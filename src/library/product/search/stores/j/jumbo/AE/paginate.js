
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'jumbo',
    nextLinkSelector: null,
    // 'div[class*="summary-response-last"] a[class*="next_page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#search-result-items>li',
    noResultsXPath: '//ul[@id="search-result-items" and not(li)] | //div[@id="no-results-found"]',
    openSearchDefinition: {
      pageOffset: 0,
      template: 'https://www.jumbo.ae/home/search?q={searchTerms}&page={page}&per_page=16&_xhr=1',
    },
    domain: 'jumbo.ae',
    zipcode: '',
  },
};
