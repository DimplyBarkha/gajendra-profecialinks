
// module.exports = {
//   implements: 'product/details/variants/variantsExtract',
//   parameterValues: {
//     country: 'UK',
//     store: 'amazonFresh',
//     transform: null,
//     domain: 'amazon.co.uk',
//     zipcode: 'NW1 8AA',
//   },
// };
const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'amazonFresh',
    transform: null,
    domain: 'amazon.co.uk',
    zipcode: 'NW1 8AA',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
  },
  implementation,
};

