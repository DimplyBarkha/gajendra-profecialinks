const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    transform,
    domain: 'mechta.kz',
    zipcode: '',
  },
};
