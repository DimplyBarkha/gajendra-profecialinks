const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: transform,
    domain: 'unieuro.it',
    zipcode: '',
  },
};