const { transform } = require('./variantFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
    zipcode: '',
  },
};
