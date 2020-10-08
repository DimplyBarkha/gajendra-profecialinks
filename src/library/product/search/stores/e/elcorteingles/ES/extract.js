const { transform } = require('../../../../shared');
// const { createSearchUrl } = require('../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('waiting for 10000');
  await new Promise((resolve, reject) => setTimeout(resolve, 1000000));
  console.log('DONE -----------------------------     ---------------------   for 10000');
  return await context.extract(productDetails, { transform });
}

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
