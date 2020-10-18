const {transform} =  require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    transform,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
};
