const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
  },
  implementation,
};
