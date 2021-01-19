
const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    transform,
    domain: 'tiendanimal.es',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(function name () {
      const searchUrl = window.location.href.replaceAll('%20', ' ');
      const lastPageUrl = document.querySelector('div#search-url');
      if (lastPageUrl) {
        // @ts-ignore
        lastPageUrl.innerText = searchUrl;
      } else {
        const hiddenSearchDiv = document.createElement('div');
        hiddenSearchDiv.id = 'search-url';
        hiddenSearchDiv.style.display = 'none';
        hiddenSearchDiv.textContent = searchUrl;
        document.body.appendChild(hiddenSearchDiv);
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await context.extract(productDetails, { transform });
  },
};
