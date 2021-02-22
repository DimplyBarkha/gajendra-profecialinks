
const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    transform,
    domain: 'amazon.nl',
  },
  implementation,
};
