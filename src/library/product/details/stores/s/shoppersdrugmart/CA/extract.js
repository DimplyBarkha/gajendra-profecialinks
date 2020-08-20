const { transform } = require('../transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    transform,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    try {
      await context.waitForSelector('div#pr-reviewsnippet div.pr-snippet-rating-decimal');
    } catch (error) {
      console.log('Ratings did not loaded');
    }
    return await context.extract(productDetails, { transform });
  },
};
