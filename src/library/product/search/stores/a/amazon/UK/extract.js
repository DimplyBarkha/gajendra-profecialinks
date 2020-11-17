const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
  },
  implementation,
};
