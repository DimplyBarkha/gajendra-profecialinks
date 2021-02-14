const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'jumbo',
    transform,
    domain: 'jumbo.ae',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    async function addUrl () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('ul#search-result-items li');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'added-searchurl', searchUrl);
      });
    }
    await context.evaluate(addUrl);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
