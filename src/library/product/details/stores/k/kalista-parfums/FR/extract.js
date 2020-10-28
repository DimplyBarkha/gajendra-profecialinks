const { transform } = require('../format.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'kalista-parfums',
    transform: transform,
    domain: 'kalista-parfums.com',
    zipcode: '',
  },
};
