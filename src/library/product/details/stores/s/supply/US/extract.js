
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'supply',
    transform: cleanUp,
    domain: 'supply.com',
    zipcode: '',
  },
  // @ts-ignore
  // implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
  //   await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  //   await context.click('div[data-title="Product Details"]');
  //   await context.evaluate(async function () {
  //     function addElementToDocument (key, value) {
  //       const catElement = document.createElement('div');
  //       catElement.id = key;
  //       catElement.textContent = value;
  //       catElement.style.display = 'none';
  //       document.body.appendChild(catElement);
  //     }
  //   });
  //   await context.extract(productDetails, { transform });
  // },

};
