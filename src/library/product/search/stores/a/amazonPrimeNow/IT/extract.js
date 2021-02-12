const { transform } = require('../../../../transform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazonPrimeNow',
    transform,
    domain: 'primenow.amazon.it',
    zipcode: '20161',
  },
  implementation,
};
