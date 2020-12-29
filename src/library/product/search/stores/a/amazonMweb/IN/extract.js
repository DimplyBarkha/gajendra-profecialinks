const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.in',
  },
  implementation,
};
