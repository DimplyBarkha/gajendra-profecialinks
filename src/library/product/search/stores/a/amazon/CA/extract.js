const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform,
    domain: 'amazon.ca',
  },
  implementation,
};
