const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    transform,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
};
