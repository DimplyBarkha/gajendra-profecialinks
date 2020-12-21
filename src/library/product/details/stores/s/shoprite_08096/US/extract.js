const { transform } = require('../../../../shared');
const { implementation } = require('./shared.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'shoprite_08096',
    transform: transform,
    domain: 'shoprite.com',
    zipcode: '',
  },
  implementation,
};
