const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform: null,
    domain: 'amazon.com',
  },
  implementation,
};
