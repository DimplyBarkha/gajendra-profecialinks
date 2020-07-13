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
    const scrollToContent = async (selector) => {
      await context.evaluate(async (selectorToWaitFor) => {
        const delay = t => new Promise(resolve => setTimeout(resolve, t));

        console.log('SCROLLING TO PAGE');
        const element = document.querySelector(selectorToWaitFor);

        if (!element) {
          console.log('Element not found');
          return;
        }

        element.scrollIntoView(false);
        await delay(1500);
        return;
      }, selector);
    }

    await scrollToContent('.askDetailPageSearchWidgetSection');

    try {
      await context.waitForSelector('#aplus', { timeout: 30000 });
    } catch (err) {
      console.log(`Manufacturer details did not load.`);
    }

    await scrollToContent('div[data-cel-widget="aplus_feature_div"]');

    return await context.extract(productDetails, { transform });
  },
};
