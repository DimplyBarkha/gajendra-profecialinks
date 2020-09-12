const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    transform,
    domain: 'eprice.it',
    zipcode: '',
  },
};
