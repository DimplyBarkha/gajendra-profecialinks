

const { transform } = require('./variantFormat')

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
};
