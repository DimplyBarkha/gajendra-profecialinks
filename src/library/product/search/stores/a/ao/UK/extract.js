const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    transform: cleanUp,
    domain: 'ao.com',
    zipcode: '',
  },
};