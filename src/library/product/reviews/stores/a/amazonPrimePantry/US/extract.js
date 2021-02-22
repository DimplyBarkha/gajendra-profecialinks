const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimePantry',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'amazon.com',
    zipcode: '10001',
  },
};
