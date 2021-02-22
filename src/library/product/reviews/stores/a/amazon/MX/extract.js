const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'MX',
    store: 'amazon',
    transform,
    domain: 'amazon.com.mx',
    filterReviews: true,
  },
};
