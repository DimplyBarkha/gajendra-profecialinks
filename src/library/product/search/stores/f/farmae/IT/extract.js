
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'farmae',
    transform,
    domain: 'farmae.it',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const searchUrl = window.location.href;
      addElementToDocument('searchUrl', searchUrl);

      const elementWithIDs = document.evaluate('//script[contains(.,"Search Results")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const products = document.querySelectorAll('ul.products-grid>li');
      const idRegex = /"id":"(\d+)/g;
      const idArray = [];
      let match = idRegex.exec(elementWithIDs.textContent);
      while (match != null) {
        idArray.push(match[1]);
        match = idRegex.exec(elementWithIDs.textContent);
      }
      products.forEach(product => {
        product.setAttribute('id', idArray.shift());
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
