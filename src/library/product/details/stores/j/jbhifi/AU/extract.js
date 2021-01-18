const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.com.au',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    try {
      await context.waitForSelector('div#pdp-google-related h4', { timeout: 100000 });
    } catch (error) {
      console.log(error);
      console.log('Similar product not found => ', error);
    }
    return await context.extract(productDetails, { transform: transformParam });
  },
};1
