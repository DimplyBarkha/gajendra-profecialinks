const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    transform: transform,
    domain: 'farmers.co.nz',
    zipcode: '',
  },
};
