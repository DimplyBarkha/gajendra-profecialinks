const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    transform,
    domain: 'amazon.in',
    filterReviews: true,
  },
};
