const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    transform,
    domain: 'amazon.ae',
  },
  implementation,
};
