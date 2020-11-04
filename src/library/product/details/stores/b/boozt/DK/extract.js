const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    transform: cleanUp,
    domain: 'boozt.com',
    zipcode: '',
  }
};