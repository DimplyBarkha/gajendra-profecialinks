const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    domain: 'amazon.ae',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
  },
  implementation,
};
