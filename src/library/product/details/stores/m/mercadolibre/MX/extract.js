const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    transform,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const el = document.querySelector('.ui-pdp-stock-information__title').innerText;
      if (el === 'Stock disponible') addElementToDocument('isStock', 'In Stock');
      else addElementToDocument('isStock', 'Out of Stock');
      addElementToDocument('url', location.href);
    });
    return await context.extract(productDetails, { transform });
  },
};
