
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'leons',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="findify-layouts--search"]',
    noResultsXPath: '//span[contains(@class,"zero-results")]|//span[contains(text(), "Showing 0 results for")]',
    openSearchDefinition: null,
    domain: 'leons.ca',
    zipcode: '',
  },
};
