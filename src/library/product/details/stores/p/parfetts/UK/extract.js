const { cleanUp } = require('../transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'parfetts',
    transform: cleanUp,
    domain: 'parfetts.co.uk',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    try {
      await context.waitForSelector(('a[class*="image"]'), { timeout: 50000 });
      await context.click('a[class*="image"]');
      await context.waitForNavigation({ timeout: 50000 });
      await context.waitForSelector(('div[class="row"]>div>img'), { timeout: 50000 });
      console.log('We have moved to product page successfully');
    } catch (e) {
      console.log('Not able to move to product page');
    }
    return await context.extract(productDetails, { transform });
  },
};
