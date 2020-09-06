const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'virginmegastore',
    transform: transform,
    domain: 'virginmegastore.sa',
    zipcode: '',
  },
};
