const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    transform: cleanUp,
    domain: 'gracobaby.com',
    zipcode: '',
  },
};
