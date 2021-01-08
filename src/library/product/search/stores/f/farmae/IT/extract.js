
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
      const productsElements = document.querySelectorAll('ul.products-grid>li');
      const productsArray = JSON.parse(`${elementWithIDs.textContent.match(/\((.+)\)/)[1]}`).ecommerce.impressions;
      productsElements.forEach(product => {
        product.setAttribute('id', productsArray.shift().id);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
