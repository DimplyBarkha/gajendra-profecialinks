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

  const url = 'https://www.euronics.de/search?sSearch=' + (inputs.keywords || inputs.Keywords) + '&n=100';
  await dependencies.goto({ url });
  return context.evaluate(function () {
    return document.querySelectorAll('.product--box').length > 0;
  });

}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'euronics',
    domain: 'euronics.de',
    url: 'https://www.euronics.de/search?sSearch={searchTerms}&n=100',
    loadedSelector: 'div.product--box',
    noResultsXPath: '//h1[contains(.,"0")]',
  },
  implementation,
};
