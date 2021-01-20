// @ts-nocheck
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    transform: cleanUp,
    domain: 'petlove.com.br',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails, transform }) => {
    const variantsTotal = await context.evaluate(
      async () => document.querySelectorAll('div.box-variants label.radio-button-item > div').length,
    );
    const iterations = variantsTotal || 1;
    for (let i = 0; i < iterations; i++) {
      if (variantsTotal > 1) {
        await context.evaluate(
          async ({ i }) => {
            document.querySelectorAll('div.box-variants label.radio-button-item > div')[i].click();
            await new Promise((resolve) => setTimeout(resolve, 500));
          },
          { i },
        );
      }
      await context.evaluate(
        async ({ i, variantsTotal }) => {
          const addMinMax = (snapshot, nodeName, variantElem) => {
            const numbersArr = [];
            const uomArr = [];

            const list = document.createElement('ol');
            list.id = nodeName;
            list.style.display = 'none';
            variantElem.appendChild(list);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
              const row = snapshot.snapshotItem(i);
              if (!(row && nodeName)) return;
              let minMatch, maxMatch;
              const regexp = /([\d,.]+) ?([a-zA-Z/]+)/;

              if (row.children.length >= 2) {
                const firstElem = row.firstElementChild;
                let secondElem = row.lastElementChild;
                if (row.children.length > 2) {
                  secondElem = Array.from(row.children).find(
                    (node, index) => !node.textContent.includes('%') && index > 0,
                  );
                }
                const hasMin = firstElem.textContent.toLowerCase().includes('mín') || firstElem.textContent.toLowerCase().includes('min');
                const hasMax = firstElem.textContent.toLowerCase().includes('máx') || firstElem.textContent.toLowerCase().includes('max');
                if (hasMin && hasMax) {
                  const valuesArr = secondElem.textContent.split(' /');
                  if (valuesArr.length === 2) {
                    minMatch = valuesArr[0].trim().match(regexp);
                    maxMatch = valuesArr[1].trim().match(regexp);
                  }
                } else if (hasMin || hasMax) {
                  minMatch = secondElem.textContent.match(regexp);
                }
              }
              if (minMatch) {
                numbersArr.push(minMatch[1]);
                uomArr.push(minMatch[2]);
              }
              if (maxMatch) {
                numbersArr.push(maxMatch[1]);
                uomArr.push(maxMatch[2]);
              }
            }
            variantElem.setAttribute(`${nodeName}_value`, numbersArr.join(' || '));
            variantElem.setAttribute(`${nodeName}_uom`, uomArr.join(' || '));
          };

          const variantElem = document.querySelectorAll('div.box-variants label.radio-button-item > div')[i];
          const variantObj = window.productJSON.variants[i];

          const allImages = variantObj.images.filter((image) => !image.large_url.includes('img.youtube.com/vi/'));
          const alternateImagesList = document.createElement('ol');
          alternateImagesList.id = 'alternate_images';
          alternateImagesList.style.display = 'none';
          for (let j = 0; j < allImages.length; j++) {
            const listItem = document.createElement('li');
            const image = allImages[j];
            listItem.setAttribute('image', image.large_url);
            listItem.setAttribute('image_alt', 'Imagem do produto');
            alternateImagesList.appendChild(listItem);
          }
          variantElem.appendChild(alternateImagesList);
          variantElem.setAttribute('secondary_image_total', (allImages.length - 1).toString());

          const allVideos = variantObj.images.filter((image) => image.large_url.includes('img.youtube.com/vi/'));
          const videosList = document.createElement('ol');
          videosList.id = 'videos';
          videosList.style.display = 'none';
          for (let j = 0; j < allVideos.length; j++) {
            const listItem = document.createElement('li');
            const video = allVideos[j];
            const videoId = video.large_url.match(/youtube\.com\/vi\/(.+)\//)[1];
            listItem.setAttribute('video', `https://www.youtube.com/embed/${videoId}`);
            videosList.appendChild(listItem);
          }
          variantElem.appendChild(videosList);

          const brand = document.querySelector('div.breadcrumb li.brand span')
            ? document.querySelector('div.breadcrumb li.brand span').textContent
            : '';
          const name = document.querySelector('h1[itemprop="name"]')
            ? document.querySelector('h1[itemprop="name"]').textContent
            : '';
          const nameExtended = name.toLowerCase().includes(brand.toLowerCase()) ? name : `${brand} - ${name}`;
          // if (variantObj.short_name) nameExtendedArr.push(variantObj.short_name);

          const currency = document.querySelector('meta[name="currency"]')
            ? document.querySelector('meta[name="currency"]').getAttribute('content')
            : 'R$';

          const couponText = document.querySelector('div.product-info div.flag')
            ? document.querySelector('div.product-info div.flag').textContent
            : '';

          // extracting description
          let descriptionArr = document.querySelector('div.product-resume')
            ? document.querySelector('div.product-resume').innerText.split('\n')
            : [];
          descriptionArr = descriptionArr.filter((item) => !!item);
          descriptionArr = descriptionArr.map((item) => item.replace(/^\s*-\s*/, ' || ').replace(/\n+/g, ' '));
          variantElem.setAttribute('description_bullets', descriptionArr.length);
          variantElem.setAttribute('description', descriptionArr.join(' ').trim());

          const unavailableLabel = document.querySelector('div.label-stock.unavailable');
          const remindButton = document.querySelector('div#reminder-area:not(.hidden) button#btn-reminder');
          if (unavailableLabel || remindButton) variantElem.setAttribute('availability_text', 'Out Of Stock');

          const directionsText = document.evaluate(
            '//h3[text() = "Dicas Petlove"]/following-sibling::div[1]',
            document,
            null,
            XPathResult.STRING_TYPE,
            null,
          ).stringValue;
          if (directionsText) variantElem.setAttribute('directions', directionsText.replace(/\n+/g, ' '));

          const quantity = variantElem.querySelector('div.label-title')
            ? variantElem.querySelector('div.label-title').textContent
            : '';
          if (quantity && quantity.match(/[\d.,]+\s.?g/)) variantElem.setAttribute('quantity', quantity);

          const ingredientsElem = document.evaluate(
            'html//tr[th[contains(text(), "Composição")]]/td',
            document,
            null,
            XPathResult.ANY_UNORDERED_NODE_TYPE,
            null,
          ).singleNodeValue;
          const ingredientsText = ingredientsElem && ingredientsElem.innerText ? ingredientsElem.innerText.replace(/\n+/g, ' ') : '';

          const calciumSnapshot = document.evaluate(
            '//tr//tr[td[contains(text(), "Cálcio")]]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null,
          );

          const fibreSnapshot = document.evaluate(
            '//tr//tr[td[contains(translate(text(), "FIBROSA", "fibrosa"), "fibrosa")]]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null,
          );

          addMinMax(calciumSnapshot, 'calcium', variantElem);
          addMinMax(fibreSnapshot, 'fibre', variantElem);

          variantElem.setAttribute('product_url', window.location.href.match(/(.+\/p)(\?.*)?/)[1]);
          variantElem.setAttribute('product_name', name);
          variantElem.setAttribute('brand', brand);
          variantElem.setAttribute('name_extended', nameExtended);
          variantElem.setAttribute('variant_count', variantsTotal);
          variantElem.setAttribute('list_price', `${currency}${variantObj.list_price}`.replace('.', ','));
          variantElem.setAttribute('price', `${currency}${variantObj.price}`.replace('.', ','));
          variantElem.setAttribute('coupon_text', couponText);
          variantElem.setAttribute('ingredients', ingredientsText);
        },
        { i, variantsTotal },
      );
    }
    await context.extract(productDetails, { transform });
  },
};
