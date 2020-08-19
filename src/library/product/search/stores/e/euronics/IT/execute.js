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

  const url = 'https://www.euronics.it/bruno/?q=' + (inputs.keywords || inputs.Keywords);
  await dependencies.goto({ url });
  return context.evaluate(function () {
    return document.querySelectorAll('.productCard__aux').length > 0;
  });

}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'euronics',
    domain: 'euronics.it',
    url: 'https://www.euronics.it/bruno/?q={searchTerms}',
    loadedSelector: 'div[data-test="product-grid"] div',
    noResultsXPath: '//h2[contains(.,"Nessun prodotto corrispondente")]',
  },
  implementation,
};
