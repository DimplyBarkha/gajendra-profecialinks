const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    transform: cleanUp,
    domain: 'cabelas.com',
    zipcode: '',
  },
};
