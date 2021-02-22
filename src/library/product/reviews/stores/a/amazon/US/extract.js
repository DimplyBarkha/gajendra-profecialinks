const { transform } = require('../transform');
const { implementation } = require('../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform,
    domain: 'amazon.com',
    filterReviews: true,
  },
  implementation,
};
