const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    transform: cleanUp,
    domain: 'lojasrede.com.br',
    zipcode: '',
  },
};
