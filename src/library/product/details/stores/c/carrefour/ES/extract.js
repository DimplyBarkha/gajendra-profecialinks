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
      let brand = document.evaluate('//p[contains(text(),"Marca")]/following-sibling::p', document).iterateNext() && document.evaluate('//p[contains(text(),"Marca")]/following-sibling::p', document).iterateNext().textContent && document.evaluate('//p[contains(text(),"Marca")]/following-sibling::p', document).iterateNext().textContent.trim();
      const obj = window.dataLayer[0];
      const gtin = (obj.productEAN && obj.productEAN[0]) || '';
      if (!brand) {
        brand = obj.productBrand || '';
      }
      document.body.setAttribute('brand', brand);
      document.body.setAttribute('gtin', gtin);
      const enhancedContentEl = document.querySelector('.flix-content');
      let enhancedContentAvailable = false;

      if (enhancedContentEl) {
        enhancedContentAvailable = true;
      }

      document.body.setAttribute('import-enhanced-content', enhancedContentAvailable.toString());
      const purchasability = document.querySelector('.pdp-view__buybox .buybox__price') ? true : false;
      document.body.setAttribute('import-puchasability', purchasability);
      const availability = document.querySelector('.pdp-view__buybox .buybox__price') ? 'In stock' : 'Out of stock';
      document.body.setAttribute('import-availability', availability);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
