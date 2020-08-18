/**
 *
 * @param { { keywords: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  const url = 'https://euronics.ie/search/?query=' + (inputs.keywords || inputs.Keywords) + '&records=150';
  await dependencies.goto({ url });
  return context.evaluate(function () {
    return document.querySelectorAll('.item').length > 0;
  });

}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'euronics',
    domain: 'euronics.ie',
    url: 'https://euronics.ie/search/?query={searchTerms}',
    loadedSelector: 'div[data-test="product-grid"] div',
    noResultsXPath: '//h3[contains(.,"No Products Found")]',
  },
  implementation,
};
