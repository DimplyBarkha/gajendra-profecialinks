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

  const url = 'https://target.com/s?searchTerm=' + inputs.keywords || inputs.Keywords;
  await dependencies.goto({ url });
  await context.waitForXPath('//ul//li');
  await stall(1000);
  return context.evaluate(function () {
    return true;
  });
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'target',
    domain: 'target.com',
    url: 'https://www.target.com/s?searchTerm={searchTerms}',
    loadedSelector: 'div[data-test="productGridContainer"] li',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
  implementation,
};
