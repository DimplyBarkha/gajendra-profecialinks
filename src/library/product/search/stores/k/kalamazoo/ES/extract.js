const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    transform,
    zipcode: '',
    domain: 'kalamazoo.es',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    // await context.evaluate(() => {
    //   var searchUrl = window.location.href;
    //   var appendElements = document.querySelectorAll('article[class*="product-card product-card--close"]');
    //   if (appendElements.length) {
    //     appendElements.forEach((element) => {
    //       element.setAttribute('searchurl', searchUrl);
    //     })
    //   }
    // });
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  }
};