const { implementation } = require('../../../../sharedAmazon/variantExtract');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'amazonMweb',
    transform: null,
    domain: 'amazon.com.au',
    zipcode: '',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
  },
  implementation,
};
