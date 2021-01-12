const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazonPrimePantry_Mweb',
    transform: transform,
    domain: 'amazon.in',
  },
  implementation,
};
