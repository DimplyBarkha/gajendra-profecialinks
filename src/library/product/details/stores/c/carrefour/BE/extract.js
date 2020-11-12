const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    transform,
    domain: 'carrefour.eu',
    zipcode: '',
  },
};
