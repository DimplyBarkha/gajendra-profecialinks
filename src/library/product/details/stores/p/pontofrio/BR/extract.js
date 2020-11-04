const { transform } = require('../format.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    transform: transform,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
};
