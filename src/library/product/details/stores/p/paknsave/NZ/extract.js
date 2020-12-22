const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'paknsave',
    transform,
    domain: 'paknsave.co.nz',
    zipcode: '',
  },
};
