const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'countdown',
    transform,
    domain: 'countdown.co.nz',
    zipcode: '',
  },
};
