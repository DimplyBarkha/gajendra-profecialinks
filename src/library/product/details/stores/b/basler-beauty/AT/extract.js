const { transform } = require('./../shared')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    transform,
    domain: 'basler-beauty.at',
    zipcode: '',
  },
};
