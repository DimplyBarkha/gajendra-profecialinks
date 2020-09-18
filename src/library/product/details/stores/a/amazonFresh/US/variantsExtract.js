const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: null,
    domain: 'amazon.com',
    zipcode: '90210',
  },
  implementation,
};
