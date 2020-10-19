const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    transform,
    domain: 'belezanaweb.com.br',
    zipcode: '',
  },
};
