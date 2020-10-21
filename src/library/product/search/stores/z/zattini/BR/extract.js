const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'zattini',
    transform: cleanUp,
    domain: 'zattini.com.br',
    zipcode: '',
  },
};
