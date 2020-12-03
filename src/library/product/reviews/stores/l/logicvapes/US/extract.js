const { transform } = require('./transform');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'logicvapes',
    transform,
    filterReviews: null,
    domain: 'logicvapes.us',
    zipcode: '',
  },
};
