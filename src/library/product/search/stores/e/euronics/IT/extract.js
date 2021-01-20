const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform,
    domain: 'euronics.it',
    zipcode: '',
  },
};