const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    transform,
    domain: 'amazon.co.jp',
    zipcode: '',
  },
};
