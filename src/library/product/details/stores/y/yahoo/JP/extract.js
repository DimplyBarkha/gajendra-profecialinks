const { transform } = require('../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'JP',
    store: 'yahoo',
    transform,
    domain: 'yahoo.co.jp',
    zipcode: '',
  },
};
