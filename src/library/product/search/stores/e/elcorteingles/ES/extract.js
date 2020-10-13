const { transform } = require('../../../../shared');
const { createSearchUrl } = require('../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform: transform,
    domain: 'elcorteingles.es',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(() => {
      var newElement = document.createElement('DIV');
      newElement.setAttribute('class', 'page-link');
      newElement.innerHTML = window.location.href;
      if (newElement) {
        document.body.appendChild(newElement);
      }
      const productTiles = document.querySelectorAll('.products_list-item');
      if (productTiles) {
        productTiles.forEach((tile) => {
          tile.scrollIntoView();
        });
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
