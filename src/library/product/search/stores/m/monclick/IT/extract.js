const { transform } = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    transform,
    domain: 'monclick.it',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    async function addUrl() {
      function addElementToDocument(doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('section[class*="listingProduct"]');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'added-searchurl', searchUrl);
      });
    }
    await context.evaluate(addUrl);
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
