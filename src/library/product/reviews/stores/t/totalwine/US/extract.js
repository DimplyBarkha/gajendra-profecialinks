const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    transform,
    filterReviews: null,
    domain: 'totalwine.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;

    while (1) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const buttonExists = await context.evaluate(async function () {
        return !!document.querySelector('div.bv-content-pagination-container button.bv-content-btn');
      });
      const stillLoading = await context.evaluate(async function () {
        return !!document.querySelector('div.bv-mbox-spinner');
      });
      if (buttonExists) {
        try {

          await context.click('div.bv-content-pagination-container button.bv-content-btn', { timeout: 35000 });
        } catch (error) {
          console.log('loading');
          // break;
        }
      } else {
        break;
      }
      if (stillLoading) {
        await new Promise(resolve => setTimeout(resolve, 35000));
        if (stillLoading) {
          break;
        }
      }
    }
    return await context.extract(productReviews, { transform });
  },
};
