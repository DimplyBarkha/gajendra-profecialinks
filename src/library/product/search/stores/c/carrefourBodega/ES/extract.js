const { transform } = require('./format');
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
  await context.evaluate(async () => {
    const loadMore = (document.querySelectorAll("div[class='js-next-preference']  a[title*='Ver m']")) ? document.querySelectorAll("div[class='js-next-preference']  a[title*='Ver m']") : [];
    loadMore.forEach(async (element, index) => {
      element.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 20000));
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation,
};
