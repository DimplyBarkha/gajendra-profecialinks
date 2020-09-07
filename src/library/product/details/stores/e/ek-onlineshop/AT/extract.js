const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ek-onlineshop',
    transform,
    domain: 'ek-onlineshop.at',
    zipcode: '',
  },
};
