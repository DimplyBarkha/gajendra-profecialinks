//const { transform } = require('../format');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: null,
    filterReviews: null,
    domain: 'walmart.com',
    zipcode: '',
  },
};
