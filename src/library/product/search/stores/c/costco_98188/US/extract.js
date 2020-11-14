const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    transform,
    domain: 'costco.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const url = window.location.href;
      const pdList = document.querySelectorAll('div.product-list div.product');
      if (pdList.length) {
        pdList.forEach((item1) => {
          const doc = item1;
          addElementToDocument(doc, 'added-search-url', url);
        });
      }
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
