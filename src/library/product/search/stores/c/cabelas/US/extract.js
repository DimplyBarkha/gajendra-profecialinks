const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    transform: cleanUp,
    domain: 'cabelas.com',
    zipcode: '',
  },
};
