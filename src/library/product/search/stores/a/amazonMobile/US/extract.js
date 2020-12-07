const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    transform,
    domain: 'amazon.com',
  },
  implementation,
};
