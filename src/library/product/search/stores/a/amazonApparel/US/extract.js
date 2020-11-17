const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonApparel',
    transform,
    domain: 'amazon.com',
  },
  implementation,
};
