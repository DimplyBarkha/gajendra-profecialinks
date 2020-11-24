const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
    domain: 'kroger.com',
    zipcode: '',
  },
};
