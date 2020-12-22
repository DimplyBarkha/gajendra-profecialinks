
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    nextLinkSelector: 'a[class="page-next"], a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="search-result-content"], div[class="shop-grid"]',
    noResultsXPath: '//div[@class="no-hits-help"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mecca.com.au',
    zipcode: '',
  },
};
