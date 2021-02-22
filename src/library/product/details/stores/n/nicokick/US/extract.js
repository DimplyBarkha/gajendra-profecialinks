const { cleanUp } = require('./../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'nicokick',
    transform: cleanUp,
    domain: 'nicokick.com',
    zipcode: '',
  },
};
