const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'elkjop',
    transform: cleanUp,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
      const resCount = document.querySelector('.count');
      // @ts-ignore
      if (resCount && resCount.innerText) {
        const resVisible = 12;
        // @ts-ignore
        var iter = Math.ceil(resCount.innerText / resVisible);
        var i;
        for (i = 0; i < iter; i++) {
          if (document.querySelector('#searchProductsInfo')) {
            window.scrollTo(0, document.querySelector('#searchProductsInfo').scrollHeight);
            await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          }
        }
      }
    });
    return await context.extract(productDetails);
  },
};