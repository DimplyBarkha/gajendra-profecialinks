const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mercadona',
    transform,
    domain: 'mercadona.es',
    zipcode: '46008',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    try {
      await context.setInputValue('input[name="postalCode"]', '46008');
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      await context.click('button.button-big');
    } catch (e) {
      console.log(e);
    }

    await context.waitForSelector('.private-product-detail');
    await context.evaluate(async () => {
      const currentProduct = document.querySelector('.private-product-detail__content');
      const imgContainer = document.querySelector('.thumbnail__container');
      const headLinesOfProduct = document.querySelectorAll('.headline1-r');
      const pricePerUnit = headLinesOfProduct[headLinesOfProduct.length - 1];

      const skuNumber = location.href.match(/\/product\/(.*?)\//)[1];
      const requestUrl = `https://tienda.mercadona.es/api/products/${skuNumber}/?lang=es&wh=vlc1`;

      const response = await fetch(requestUrl).then(res => res.json());
      const { price_instructions } = response;
      const { brand } = response.details;
      const { photos } = response;

      console.log(photos);

      console.log(price_instructions);

      console.log(response);
      function addHiddenDiv (className, content, node) {
        const newDiv = document.createElement('div');
        newDiv.className = className;
        newDiv.textContent = content;
        newDiv.style.display = 'none';

        node.appendChild(newDiv);
      }

      function getPackSize () {
        if (price_instructions.total_units) {
          console.log(price_instructions.total_units);
          return price_instructions.total_units;
        }

        return 'null';
      }

      if (currentProduct) {
        const size = getPackSize();
        // const mainUrl = 'https://tienda.mercadona.es/product/';
        addHiddenDiv('helper-pack-size', size, currentProduct);
        // addHiddenDiv('helper-product-url', mainUrl + skuNumber, currentProduct);
        // addHiddenDiv('price-per-unit', pricePerUnit.textContent, currentProduct);
        addHiddenDiv('helper-sku', response.id, currentProduct);
        addHiddenDiv('helper-price', `€${price_instructions.unit_price}`, currentProduct);
        addHiddenDiv('helper-reference_price', `${price_instructions.reference_price}`, currentProduct);
        addHiddenDiv('helper-reference_format', `${price_instructions.reference_format}`, currentProduct);
        addHiddenDiv('helper-ean', response.ean, currentProduct);
        addHiddenDiv('helper-ean', response.ean, currentProduct);
        addHiddenDiv('helper-brand', brand, currentProduct);
        photos.forEach(item => {
          console.log(item.regular);
          addHiddenDiv('helper-secondary-images', item.regular, imgContainer);
        });
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
