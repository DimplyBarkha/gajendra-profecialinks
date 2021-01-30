const { transform } = require('../CA/variantFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
};
