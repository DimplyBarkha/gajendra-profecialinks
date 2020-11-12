const { transform } = require('../../../../shared');
const { implementation } = require('../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28277',
    transform: transform,
    domain: 'harristeeter.com',
    zipcode: '',
  },
  implementation,
};
