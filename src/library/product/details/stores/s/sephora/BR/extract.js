const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    transform,
    domain: 'sephora.com.br',
    zipcode: '',
  },
};
