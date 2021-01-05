const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.com.au',
  },
  implementation,
};



