
const { implementation } = require('../../../../sharedAmazon/variantExtract');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    transform: null,
    domain: 'amazon.in',
    zipcode: '',
  },
  implementation,
};
