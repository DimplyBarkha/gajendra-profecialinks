
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: '',
    store: 'stockmann',
    domain: 'stockmann.com',
    url: 'https://www.stockmann.com/haku?q={searchTerms}',
    loadedSelector: 'div.products-view-body',
    noResultsXPath: '//div[contains(@class,"sp-message-not-found")]',
  },
};
