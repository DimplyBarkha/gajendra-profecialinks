const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazonPrimeNow',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'primenow.amazon.it',
    zipcode: '20161',
  },
};
