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

  const url = 'https://www.euronics.co.uk/search/?text=' + inputs.keywords || inputs.Keywords;
  await dependencies.goto({ url }, {timeout: 50000});
  await context.waitForXPath('//div[@class="search-listing-section container"]', {timeout: 50000});
  await stall(2000);
  return context.evaluate(function () {
    return document.querySelectorAll('.product-listing__item').length > 0;
  });
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    domain: 'euronics.co.uk',
    url: 'https://www.euronics.co.uk/search/?text={searchTerms}',
    loadedSelector: 'div[class="yCmsContentSlot product-grid-right-result-slot"] div',
    noResultsXPath: '//span[contains(.,"0 items found")]',
  },
  implementation,
};
