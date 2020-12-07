const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform,
    domain: 'amazon.ca',
    filterReviews: true,
  },
};
