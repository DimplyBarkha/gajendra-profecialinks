const { transform } = require('./format');
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "FR",
    store: "intermarche",
    transform,
    domain: "intermarche.com",
    zipcode: "",
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      await context.evaluate(async function () {
        const cookieButton = document.querySelector('.didomi-popup-view .didomi-popup-close.didomi-no-link-style');
        if (cookieButton) {
          cookieButton.click();
        }
      });
    } catch (error) {
      console.log('cookie button not found', error.message);
    }
    try {
      await context.waitForSelector('div[class*="ProductGeneralInfoContainer"]', { timeout: 80000 });
    } catch (error) {
      console.log('Page not loaded', error.message);
      throw new Error('Product page not loaded');
    }
    await context.evaluate(function (parentInput) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const prodUrl = window.location.href.split('product/');
      if (prodUrl[1]) {
        addHiddenDiv('ii_url', prodUrl[1]);
      }
      addHiddenDiv('ii_parentInput', parentInput);
    }, parentInput);
    return await context.extract(productDetails, { transform: transformParam });
  },
};