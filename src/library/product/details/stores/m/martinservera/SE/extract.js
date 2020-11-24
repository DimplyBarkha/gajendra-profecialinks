const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'martinservera',
    transform,
    domain: 'martinservera.se',
    zipcode: '',
  },
};
