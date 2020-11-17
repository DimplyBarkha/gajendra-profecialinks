
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: '',
    store: 'stockmann',
    domain: 'stockmann.com',
    url: 'https://www.stockmann.com/haku?q={searchTerms}',
    loadedSelector: 'div.product-grid',
    noResultsXPath: '//div[contains(@class,"no-results")]',
  },
};
