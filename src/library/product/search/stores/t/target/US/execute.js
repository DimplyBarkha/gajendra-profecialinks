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
  await stall(2000);
  await context.setInputValue('input#search', inputs.keywords || inputs.Keywords);
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    let isCategoryPage = false;
    document.querySelectorAll('h2').forEach(e => {
      if (e.innerHTML === 'Shop by category') {
        isCategoryPage = true;
      }
    });
    if (isCategoryPage) {
      document.getElementById('search').focus();
      await stall(2000);
      const link = document.querySelector('.TypeaheadItemLink-sc-125kxr2-0');
      if (link != null) {
        link.click();
      }
    }
  });
  return context.evaluate(function () {
    return document.querySelectorAll('li').length > 0;
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
