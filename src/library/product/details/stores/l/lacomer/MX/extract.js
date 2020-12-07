const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    transform: cleanUp,
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
};
