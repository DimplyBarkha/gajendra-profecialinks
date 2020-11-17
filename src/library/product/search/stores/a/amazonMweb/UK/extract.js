const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.co.uk',
  },
  implementation,
};
