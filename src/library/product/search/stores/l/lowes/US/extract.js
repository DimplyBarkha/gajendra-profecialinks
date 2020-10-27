const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: cleanUp,
    domain: 'lowes.com',
    zipcode: '',
  },
};
