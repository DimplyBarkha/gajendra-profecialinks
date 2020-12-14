const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    transform: null,
    domain: 'liverpool.mx',
    zipcode: '',
  }
};