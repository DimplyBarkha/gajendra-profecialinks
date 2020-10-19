const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    transform,
    domain: 'belezanaweb.com.br',
    zipcode: '',
  },
};
