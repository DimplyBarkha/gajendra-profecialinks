const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform: cleanUp,
    domain: 'jumbo.com',
    zipcode: '',
  },
};
