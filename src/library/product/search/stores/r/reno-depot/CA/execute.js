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

  const url = 'https://www.renodepot.com/webapp/wcs/stores/servlet/RenoSearchDisplayView?storeId=10701&catalogId=10551&langId=-1&searchKey=RenoDepotEN&searchTerm=' + (inputs.keywords || inputs.Keywords) + '&sortList=&pageSize=infinite&navDescriptors=&searchFilter=&navRangeFilters=';
  await dependencies.goto({ url }, { timeout: 50000 });
  await stall(2000);

  return context.evaluate(function () {
    return document.querySelectorAll('.product_box').length > 0;
  });
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'reno-depot',
    domain: 'renodepot.com',
    url: 'https://www.renodepot.com/webapp/wcs/stores/servlet/RenoSearchDisplayView?storeId=10701&catalogId=10551&langId=-1&searchKey=RenoDepotEN&searchTerm={searchTerms}&sortList=&pageSize=infinite&navDescriptors=&searchFilter=&navRangeFilters=',
    loadedSelector: 'div[@class="module_productlist"]',
    noResultsXPath: '//div[contains(.,"We couldn\'t find any results for")]',
  },
  implementation,
};
