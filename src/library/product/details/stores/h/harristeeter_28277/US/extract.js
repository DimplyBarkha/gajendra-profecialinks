const { transform } = require('../../../../shared');
const { implementation } = require('../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28277',
    transform: transform,
    domain: 'harristeeter.com',
    zipcode: '',
  },
  implementation,
};
