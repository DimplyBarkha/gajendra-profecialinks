const { transform } = require('./variantFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    transform,
    domain: 'keurig.com',
    zipcode: '',
  },
};
