const {transform} = require('../variantsFormat')

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    transform,
    domain: 'sephora.com.br',
    zipcode: '',
  },
};
