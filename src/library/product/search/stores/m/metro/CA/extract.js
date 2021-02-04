const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    transform,
    domain: 'metro.ca',
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
      var appendElements = document.querySelectorAll('div[data-substitution-permission="NO"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
