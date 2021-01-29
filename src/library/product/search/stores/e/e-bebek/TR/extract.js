// @ts-nocheck
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    transform: transform,
    domain: 'e-bebek.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const searchUrl = document.querySelector('link[rel="alternate"][hreflang="tr"]')
        ? document.querySelector('link[rel="alternate"][hreflang="tr"]').getAttribute('href') : '';
      addElementToDocument('searchurl', searchUrl);
    });

    return await context.extract(productDetails, { transform });
  },
};
