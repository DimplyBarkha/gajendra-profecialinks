
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UAE',
    store: 'sharafdg',
    transform: transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    });
    return await context.extract(productDetails, { transform });
  },
};
