const { transform } = require('../../amazonPharmapacks/US/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform,
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async (selector) => {
      const delay = t => new Promise(resolve => setTimeout(resolve, t));

      console.log('SCROLLING TO PAGE');
      const element = document.querySelector(selector);

      if (!element) {
        console.log('Element not found');
        return;
      }

      element.scrollIntoView();
      await delay(3000);
      return;
    }, 'div[data-cel-widget="aplus_feature_div"]');

    return await context.extract(productDetails, { transform });
  },
};
