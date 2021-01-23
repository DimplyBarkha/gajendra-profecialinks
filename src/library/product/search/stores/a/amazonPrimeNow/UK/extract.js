const { transform } = require('../../../../transform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimeNow',
    transform,
    domain: 'primenow.amazon.co.uk',
    zipcode: 'EC1A1CB',
  },
  implementation,
};
