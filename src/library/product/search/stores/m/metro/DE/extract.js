const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'metro',
    transform,
    domain: 'metro.de',
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
    await context.evaluate(async () => {
      var searchUrl = window.location.href;
      var appendElements = document.querySelectorAll('.well-sm.well>div>div[class="mfcss_card-article-2--container-flex"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
