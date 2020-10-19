const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'officedepot',
    transform,
    domain: 'officedepot.com',
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
      var appendElements = document.querySelectorAll('div[class*="sku_item"]');
      if (appendElements.length) {
      appendElements.forEach((element) => {
      element.setAttribute('search_url', searchUrl);
      })
      }
    });
    return await context.extract(productDetails, { transform });
  }
};