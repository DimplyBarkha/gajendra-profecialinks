
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'leons',
    domain: 'leons.ca',
    url: 'https://www.leons.ca/pages/search-results?q={searchTerms}',
    loadedSelector: null, //'div[class*="findify-components-common--grid"] div[class*=grid__column]',
    noResultsXPath: null, //'//span[contains(@class,"zero-results")]|//span[contains(text(), "Showing 0 results for")] | //div[contains(@class, "breadcrumbs-container")]//span[contains(@class, "text") and contains(text(), "0 results for")]',
    zipcode: '',
  },
};
