const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'newworld',
    transform,
    domain: 'newworld.co.nz',
    zipcode: '',
  },
};
