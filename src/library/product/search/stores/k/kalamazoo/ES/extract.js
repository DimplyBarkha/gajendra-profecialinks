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
    await context.evaluate(() => {
      var searchUrl = window.location.href;
      var appendElements = document.querySelectorAll('div[id="SKUDetailsDiv"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        })
      }
      var cookiesElement = document.querySelector('button[id="onetrust-accept-btn-handler"]');
      if (cookiesElement) {
        cookiesElement.click();
      }
    });
    return await context.extract(productDetails, { transform });
  }
};