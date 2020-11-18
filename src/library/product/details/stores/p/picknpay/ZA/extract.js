const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'picknpay',
    transform: transform,
    domain: 'pnp.co.za',
    zipcode: '',
  },
};
