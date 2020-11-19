
const { transform } = require('./variantFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    transform,
    domain: 'elkjop.no',
    zipcode: '',
  },
};
