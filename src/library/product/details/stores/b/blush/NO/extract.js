const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    transform: cleanUp,
    domain: 'blush.no',
    zipcode: '',
  },
  mplementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.extract(productDetails, { transform });
  },
};
