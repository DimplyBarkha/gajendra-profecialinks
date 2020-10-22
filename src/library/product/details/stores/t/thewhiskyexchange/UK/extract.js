const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    transform: cleanUp,
    domain: 'thewhiskyexchange.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom (element, id) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      }
      
    });
    await context.extract(productDetails);
  }
};
