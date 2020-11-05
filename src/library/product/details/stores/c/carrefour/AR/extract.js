const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    transform,
    domain: 'carrefouruae.com',
    zipcode: '',
  },
};
