const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    transform,
    zipcode: '',
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
    await context.evaluate(() => {
      const searchUrl = window.location.href;
      const appendElements = document.querySelectorAll('article[class="productCard__2nWxIKmi"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
