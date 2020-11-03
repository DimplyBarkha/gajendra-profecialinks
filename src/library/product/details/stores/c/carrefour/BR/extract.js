const { cleanUp } = require('../../../../shared.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'Carrefour',
    transform: cleanUp,
    domain: 'carrefour.com.br',
    zipcode: '',
  },
};
