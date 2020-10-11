const { transform } = require('../../../../shared');

async function implementation (
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
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    transform,
    domain: 'elcorteingles.es',
  },
  implementation,
};
