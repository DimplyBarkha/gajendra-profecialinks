const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    transform,
    domain: 'eprice.it',
    zipcode: '',
  },
};
