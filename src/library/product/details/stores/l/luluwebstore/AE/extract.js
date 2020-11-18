const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'luluwebstore',
    transform: cleanUp,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
};
