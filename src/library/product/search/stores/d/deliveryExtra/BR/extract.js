const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'deliveryExtra',
    transform,
    domain: 'clubeextra.com.br',
    zipcode: '',
  },
};
