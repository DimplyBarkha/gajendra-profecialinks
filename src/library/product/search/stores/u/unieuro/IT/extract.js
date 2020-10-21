const { transform } = require('../../../../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
