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
      var newElement = document.createElement('DIV');
      newElement.setAttribute('class', 'page-link');
      newElement.innerHTML = window.location.href;
      if (newElement.innerHTML) {
        document.body.appendChild(newElement);
      }
      const productTiles = document.querySelectorAll('.products_list-item');
      if (productTiles.length > 1) {
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
