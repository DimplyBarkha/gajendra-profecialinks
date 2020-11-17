const { transform } = require('../../../../transform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow',
    transform,
    domain: 'primenow.amazon.com',
  },
  implementation,
};
