const { transform } = require('./../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    transform,
    domain: 'basler-beauty.at',
    zipcode: '',
  },
};
