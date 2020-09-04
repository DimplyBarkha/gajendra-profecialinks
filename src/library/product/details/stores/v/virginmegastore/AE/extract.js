const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'virginmegastore',
    transform: transform,
    domain: 'virginmegastore.ae',
    zipcode: '',
  },
};
