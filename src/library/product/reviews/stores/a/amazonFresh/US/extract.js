const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'amazon.com',
    zipcode: '',
  },
};
