
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    url: 'https://www.walmart.ca/search?q={searchTerms}',
    loadedSelector: "[data-automation*='product-results'] [data-automation*='product']",
    noResultsXPath: "//div[contains(@data-automation,'search-result-header') and contains(.,'We couldn')]",
    zipcode: '',
  },
};
