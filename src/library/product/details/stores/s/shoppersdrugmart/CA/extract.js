const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    transform,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForSelector('div#pr-reviewsnippet div.pr-snippet-rating-decimal');
    } catch (error) {
      console.log('Ratings did not loaded');
    }
    try {
      await context.waitForSelector('div[id="pr-reviewsnippet"] div[class~="pr-rating-stars"]');
    } catch (error) {
      console.log('Ratings did not loaded');
    }
    try {
      await context.waitForSelector('#scroll-slider-image ul:first-child li:first-child picture img');
    } catch (error) {
      console.log('image did not loaded');
    }
    return await context.extract(productDetails, { transform });
  },
};
