const { transform } = require('./transform');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'vusevapor',
    transform,
    filterReviews: null,
    domain: 'vusevapor.com',
    zipcode: '',
  },
};
