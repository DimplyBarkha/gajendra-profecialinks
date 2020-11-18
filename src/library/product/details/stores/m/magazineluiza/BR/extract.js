const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    transform,
    domain: 'magazineluiza.com.br',
    zipcode: '',
  },
};
