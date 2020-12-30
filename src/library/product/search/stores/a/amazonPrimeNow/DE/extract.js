const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonPrimeNow',
    transform,
    domain: 'primenow.amazon.de',
    zipcode: '10115',
  },
  implementation,
};






