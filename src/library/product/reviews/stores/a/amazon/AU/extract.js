const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'amazon',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'amazon.com.au',
    zipcode: '',
  },
};
