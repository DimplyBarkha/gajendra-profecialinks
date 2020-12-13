
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'mediamarkt',
    domain: 'mediamarkt.pt',
    url: 'https://mediamarkt.pt/pages/search-results-page?q={searchTerms}',
    loadedSelector: 'div#snize-search-results-grid-mode ul.snize-search-results-content',
    noResultsXPath: "//div[contains(@class, 'snize-no-products-found-text')]",
    zipcode: '',
  },
};
