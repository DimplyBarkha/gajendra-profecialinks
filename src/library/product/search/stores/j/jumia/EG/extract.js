const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    transform,
    domain: 'jumia.com.eg',
    zipcode: '',
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
      var searchUrl = window.location.href;
      var appendElements = document.querySelectorAll('article[class*="prd _fb"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        })
      }
    });
    return await context.extract(productDetails, { transform });
  }
};
