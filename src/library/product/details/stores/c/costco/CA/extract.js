const { transform } = require('../sharedTransform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform,
    domain: 'costco.ca',
    zipcode: 'M5V 2A5',
  },
  implementation,
};
