const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    transform,
    domain: 'amazon.nl',
    filterReviews: true,
  },
};
