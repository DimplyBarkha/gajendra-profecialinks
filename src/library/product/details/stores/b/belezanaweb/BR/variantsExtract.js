const {transform} = require('../variantsFormat')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    transform,
    domain: 'belezanaweb.com.br',
    zipcode: '',
  },
};
