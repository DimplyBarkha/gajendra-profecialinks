const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'thebrick',
    transform,
    domain: 'thebrick.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
