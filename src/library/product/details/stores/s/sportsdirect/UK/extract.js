const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform: cleanUp,
    domain: 'sportsdirect.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async function(context) {
      const seeAllSelector = document.querySelector('li[id="liItem"]:nth-child(1)');
      if(seeAllSelector) {
        seeAllSelector.click();
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
