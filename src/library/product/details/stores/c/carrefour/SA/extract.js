const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'carrefour',
    transform,
    domain: 'carrefourksa.com',
    zipcode: '',
  },
};
