
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    nextLinkSelector: "a[data-automation*='pagination-next-button']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "[data-automation*='product-results'] [data-automation*='product']",
    noResultsXPath: "//div[contains(@data-automation,'search-result-header') and contains(.,'We couldn')]",
    openSearchDefinition: null,
    domain: 'walmart.ca',
    zipcode: '',
  },
};
