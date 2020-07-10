const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefour',
    transform,
    domain: 'carrefour.es',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const clickOnImages = async function () {
        function timeout (ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        const nextButton = document.querySelector('div.main-image__container img');
        if (nextButton) {
          nextButton.click();
          await timeout(5000);
        }
      };
      await clickOnImages();
      const obj = window.dataLayer[0];
      const brand = obj ? obj.productBrand : '';
      const gtin = !obj ? '' : obj.productEAN ? obj.productEAN[0] : '';
      document.body.setAttribute('brand', brand);
      document.body.setAttribute('gtin', gtin);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
