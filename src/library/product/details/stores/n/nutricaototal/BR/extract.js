const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'nutricaototal',
    transform,
    domain: 'nutricaototal.com.br',
    zipcode: '',
  },
};
