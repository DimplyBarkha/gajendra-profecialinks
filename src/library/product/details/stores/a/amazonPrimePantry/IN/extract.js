const { implementation } = require('../../amazon/IN/extract');
// const { implementation } = require('../../../a/amazon/US/extract');
const { transform } = require('../../../../sharedAmazon/transformNew');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazonPrimePantry',
    transform: transform,
    domain: 'amazon.in',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    goto: 'action:navigation/goto',
  },
  implementation,
};
