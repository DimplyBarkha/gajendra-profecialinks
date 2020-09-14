const { cleanUp } = require('../../../../shared');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform: cleanUp,
    domain: 'costco.com',
    zipcode: '94209',
  },
  implementation,
};
