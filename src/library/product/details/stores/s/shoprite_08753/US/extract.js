const { cleanUp } = require('../../../../shared');
const { implementation } = require('../../shoprite_08096/US/shared.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'shoprite_08753',
    transform: cleanUp,
    domain: 'shoprite.com',
    zipcode: '',
  },
  implementation,
};
