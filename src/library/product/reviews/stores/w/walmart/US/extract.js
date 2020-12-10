const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform,
    filterReviews: true,
    domain: 'walmart.com',
    zipcode: '',
  }
};
