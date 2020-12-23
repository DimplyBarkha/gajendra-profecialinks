const { implementation } = require('../../../a/amazon/US/extract');
const { transform } = require('../../../../sharedAmazon/transformNew');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazonPrimeNow',
    transform,
    domain: 'primenow.amazon.it',
    zipcode: '20161',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    goto: 'action:navigation/goto',
  },
  implementation,
};
