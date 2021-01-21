
const { implementation } = require('../../../a/amazon/US/extract');
const { transform } = require('../../../../sharedAmazon/transformNew');
  module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
      country: 'UK',
      store: 'amazonFresh',
      transform: transform,
      domain: 'amazon.co.uk',
      
    },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    goto: 'action:navigation/goto',
  },
  implementation,
};
// const doesPopupExist = await context.evaluate(function () {
//   return Boolean(document.querySelector('div.cookie button[name="accept_cookie"]'));
// });
// if (doesPopupExist) {
//   await context.click('div.cookie button[name="accept_cookie"]');
// }