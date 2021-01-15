const { cleanUp } = require('../../../../shared');
const { implementation } = require('../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'harristeeter',
    transform: cleanUp,
    domain: 'harristeeter.com',
    zipcode: '',
  },
  implementation,
};
