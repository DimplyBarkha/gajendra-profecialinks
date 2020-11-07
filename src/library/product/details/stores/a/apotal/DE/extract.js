
const { transform } = require('../format.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'apotal',
    transform: transform,
    domain: 'apotal.de',
    zipcode: '',
  },
  // implementation: async ({ id }, { transform }, context, { productDetails: data }) => {
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   const linkSelector = await context.evaluate(async function () {
  //     return document.querySelector('h3[itemprop*="name"] a');
  //   });
  //   if (linkSelector) {
  //     await context.waitForSelector('h3[itemprop*="name"] a');
  //     await context.click('h3[itemprop*="name"] a');
  //     await new Promise(resolve => setTimeout(resolve, 5000));
  //   }
  //   return await context.extract(data, { transform });
  // },
};
