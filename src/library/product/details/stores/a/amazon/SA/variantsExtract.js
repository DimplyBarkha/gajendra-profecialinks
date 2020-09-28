const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    transform: null,
    domain: 'amazon.sa',
    zipcode: '',
  },
  implementation,
};
