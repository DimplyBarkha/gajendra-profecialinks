const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    transform,
    filterReviews: true,
    // filterReviews: false,
    domain: 'totalwine.com',
    mergeType: 'MERGE_ROWS',
    zipcode: '',
  },
};
