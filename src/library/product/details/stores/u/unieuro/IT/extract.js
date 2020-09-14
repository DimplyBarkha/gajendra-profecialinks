const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: transform,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
