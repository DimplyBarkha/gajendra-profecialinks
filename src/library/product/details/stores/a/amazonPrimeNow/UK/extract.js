const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../amazon/DE/extract');


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimeNow',
    transform: transform,
    domain: 'primenow.amazon.co.uk',
    zipcode: 'EC1A1CB',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    goto: 'action:navigation/goto',
  },
  implementation,
};
