const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'amazon',
    transform,
    domain: 'amazon.com.au',
    zipcode: '',
  },
  implementation,
};
