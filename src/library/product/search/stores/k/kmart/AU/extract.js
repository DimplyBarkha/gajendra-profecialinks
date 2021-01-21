const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    transform: cleanUp,
    domain: 'kmart.com.au',
    zipcode: '',
  },
};