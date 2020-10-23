const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../amazon/DE/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonApohealth',
    transform,
    domain: 'amazon.de',
    zipcode: '10117',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
