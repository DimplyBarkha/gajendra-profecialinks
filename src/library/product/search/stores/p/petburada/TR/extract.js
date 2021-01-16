const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'petburada',
    transform,
    domain: 'petburada.tr',
    zipcode: "''",
  },
  implementation,
};

/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let count = document.querySelectorAll('div#ProductPageProductList > div.ItemOrj').length;
    while (count <= 150) {
      if (document.querySelector('#divScrollContainer')) {
        document.querySelector('#divScrollContainer').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        count = document.querySelectorAll('div#ProductPageProductList > div.ItemOrj').length;
      } else {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
