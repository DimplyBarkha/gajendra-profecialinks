const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    transform: cleanUp,
    domain: 'tigerdirect.com',
    zipcode: '',
  },
};
