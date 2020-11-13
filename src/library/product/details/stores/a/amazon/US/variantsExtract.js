const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
  },
  dependencies: {
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
  },
  implementation,
};
