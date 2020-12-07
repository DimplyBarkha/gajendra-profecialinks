const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform,
    domain: 'amazon.it',
    filterReviews: true,
  },
};
