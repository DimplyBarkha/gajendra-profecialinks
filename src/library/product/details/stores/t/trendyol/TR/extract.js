const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    transform,
    domain: 'trendyol.com',
    zipcode: '',
  },
};
