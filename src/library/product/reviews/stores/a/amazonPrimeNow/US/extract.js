const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'primenow.amazon.com',
    zipcode: '',
  },
};


