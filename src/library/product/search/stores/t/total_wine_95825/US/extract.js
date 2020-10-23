const { transform } = require("../shared")
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'total_wine_95825',
    transform,
    zipcode: "95825",
    domain: 'totalwine.com',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(async () => {
      const closeButton = document.querySelector('button[class="backButton__2KmT2m2I"]');
      if (closeButton) {
        closeButton.click();
        console.log('able to click the close button')
        await new Promise(resolve => { setTimeout(resolve, 10000) })
      } else {
        console.log('not able to click the close button')
      }
      const searchUrl = window.location.href;
      const appendElements = document.querySelectorAll('article[class="productCard__2nWxIKmi"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        })
      }
    });
    return await context.extract(productDetails, { transform });
  }
};
