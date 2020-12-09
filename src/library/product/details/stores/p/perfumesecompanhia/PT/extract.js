
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    transform: null,
    domain: 'perfumesecompanhia.pt',
    zipcode: "''",
  },
  implementation: async ({ inputString, id }, { transform }, context, { productDetails }) => {
    // Check if the product is available and go to product page
    console.log(productDetails);
    let noResults = false;
    console.log('Wait for the product to load');
    try {
      await context.waitForFunction(
        (selector) => {
          return !!(document.querySelector(selector));
        },
        { timeout: 10000 },
      `#containerResultsFilter img[src*="${id}"]`,
      );
    } catch (e) {
      console.log('No results for the given product code');
      noResults = true;
    }
    if (!noResults) {
      await context.click(`#containerResultsFilter img[src*="${id}"]`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      // @ts-ignore
      const variantsIdArr = await context.evaluate(async () => [...document.querySelectorAll('button[data-class][data-id]')].map(el => el.getAttribute('data-id')));
      const numOfVariants = variantsIdArr.length;
      for (let i = 0; i < numOfVariants; i++) {
        await context.evaluate(
          async ({ i, variantsIdArr }) => {
            const addedVariant = document.createElement('div');
            addedVariant.id = `addedVariant${i}`;
            addedVariant.id = `added_variant${i}`;
            addedVariant.style.display = 'none';
            const variantId = variantsIdArr[i];
            const variantElement = document.querySelector(`div[id="${variantId}"]`);
            const price = document.evaluate('.//form//div[@id="price"]/text()', variantElement, null, XPathResult.STRING_TYPE, null).stringValue;
            const listPrice = document.evaluate('.//form//div[@class="old-price"]/text()', variantElement, null, XPathResult.STRING_TYPE, null).stringValue;
            const variantName = variantElement.querySelector('div.nome_detalhe_produto') ? variantElement.querySelector('div.nome_detalhe_produto').textContent.trim() : '';
            const name = document.querySelector('div.produto-consulta-detalhes > h1').textContent.replace(/\n|\s{2,}/g, ' ').trim();
            const availability = variantElement.querySelector('div.disponibilidade') ? variantElement.querySelector('div.disponibilidade').textContent : 'Out of Stock';
            const quantity = document.querySelector(`div.wrap-ml > button[data-id="${variantId}"]`)
              ? document.querySelector(`div.wrap-ml > button[data-id="${variantId}"]`).textContent : '';
            const color = document.querySelector(`div.wrap-cor > button[data-id="${variantId}"]`)
              ? variantName : '';
            const thumbnailPart = document.querySelector(`button[data-id="${variantId}"]`) ? document.querySelector(`button[data-id="${variantId}"]`).getAttribute('data-img-url') : '';
            const thumbnailAlt = document.querySelector(`button[data-id="${variantId}"]`) ? document.querySelector(`button[data-id="${variantId}"]`).getAttribute('data-img-alt') : '';
            addedVariant.setAttribute('price', price);
            addedVariant.setAttribute('list-price', listPrice);
            addedVariant.setAttribute('variant-id', variantId);
            addedVariant.setAttribute('name-extended', variantName ? `${name} - ${variantName}` : name);
            addedVariant.setAttribute('availability', availability);
            addedVariant.setAttribute('quantity', quantity);
            addedVariant.setAttribute('color', color);
            addedVariant.setAttribute('thumbnail', thumbnailPart ? `https://www.perfumesecompanhia.pt${thumbnailPart}` : '');
            addedVariant.setAttribute('thumbnail-alt', thumbnailAlt);
            document.body.appendChild(addedVariant);
          },
          { i, variantsIdArr },
        );
      }
      await context.evaluate(async function () {
        const addElementToDocument = (key, value) => {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        };
        function appendData (data) {
          const keys = Object.keys(data);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const name = `added-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
            addElementToDocument(name, data[key]);
          }
        }
        const data = {};
        // @ts-ignore
        data.altImages = [...document.querySelectorAll('img[id*=thumb-]')].filter(el => !el.id.includes('thumb-0')).map(el => el.src);
        data.altImagesCount = data.altImages.length;
        data.ratingCount = document.querySelector('div.rating-nr').textContent.match(/\((\d+)\)/)[1];
        data.aggregateRating = document.querySelector('div.rating-nr').textContent.match(/(\d(.\d+)?)\s?\/\s?5/)[1].replace('.', ',');
        data.zoomPresent = document.querySelector('#thumb-0-lens') ? 'Yes' : 'No';
        // @ts-ignore
        let variants = [...document.querySelectorAll('div.nome_detalhe_produto')].map(el => el.innerText.trim()).filter(el => !!el);
        // @ts-ignore
        if (!variants.length) variants = [...document.querySelectorAll('button[data-img-alt]')].map(el => el.innerText.trim());
        data.variants = variants;
        data.variantsCount = variants.length;
        appendData(data);
      });
      await context.extract(productDetails, { transform });
    }
  },
};
