const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(() => {
      var currentUrl = window.location.href;
      var newElement = document.createElement('DIV');
      newElement.setAttribute('class', 'page-link');
      newElement.innerHTML = currentUrl;
      document.body.appendChild(newElement);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },

};
