const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    transform,
    domain: 'amazon.ae',
    filterReviews: true,
  },
};
