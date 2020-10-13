
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    transform,
    domain: 'k-ruoka.fi',
    zipcode: '',
  }, implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    // await context.evaluate(async function () {
    //   var acceptCookies = document.querySelector('button.accept-button');
    //   if (acceptCookies) {
    //     acceptCookies.click()
    //   }

    // });
    await context.evaluate(async function () {
      // function timeout(ms) {
      //   return new Promise((resolve) => setTimeout(resolve, ms));
      // }
      // await timeout(5000);
      const NutritionInfo = document.querySelector('div.shopping-list-product-details-container section.collapsible-container.product-nutritional-detail a');
      if (NutritionInfo) {
        NutritionInfo.click();
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
