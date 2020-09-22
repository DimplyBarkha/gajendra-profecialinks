const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform: null,
    domain: 'amazon.it',
    zipcode: '20019',
  },
  implementation,
};
