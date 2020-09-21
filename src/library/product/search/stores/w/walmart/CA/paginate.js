module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    // nextLinkSelector: "a[data-automation*='pagination-next-button']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "[data-automation*='product-results'] [data-automation*='product']",
    noResultsXPath: "//div[contains(@data-automation,'search-result-header') and contains(.,'We couldn')] | //h1[contains(@data-automation,'null-results-message')]",
    openSearchDefinition: {
      page: 0,
      template: 'https://www.walmart.ca/search?q={searchTerms}&p={page}',
    },
    domain: 'walmart.ca',
    zipcode: '',
  },
};
