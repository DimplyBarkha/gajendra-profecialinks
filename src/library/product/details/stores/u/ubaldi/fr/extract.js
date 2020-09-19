const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'fr',
    store: 'ubaldi',
    transform: transform,
    domain: 'ubaldi.com',
    zipcode: "''",
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 400000));
    return await context.extract(productDetails, { transform });
  },
};
