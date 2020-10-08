const { transform } = require('../../../../shared');
// const { createSearchUrl } = require('../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'elcorteingles_electronica',
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
      document.body.appendChild(newElement);
      const productTiles = document.querySelectorAll('.products_list-item');
      productTiles.forEach((tile) => {
        tile.scrollIntoView();
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
