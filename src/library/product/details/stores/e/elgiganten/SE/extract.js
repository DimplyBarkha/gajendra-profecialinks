const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform: cleanUp,
    domain: 'elgiganten.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function clickOnTabs () {
        document.getElementById('tab-more-info').click();
        document.getElementById('tab-specs').click();
      }
      clickOnTabs();
    });
    await context.extract(productDetails);
  },
};
