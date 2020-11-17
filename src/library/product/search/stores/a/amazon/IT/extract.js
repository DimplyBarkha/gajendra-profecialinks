const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform,
    domain: 'amazon.it',
  },
  implementation,
};
