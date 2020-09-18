const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: '',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: '',
  },
};
