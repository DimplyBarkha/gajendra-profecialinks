const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'carrefourksa',
    transform,
    domain: 'carrefourksa.com',
    zipcode: '',
  },
};
