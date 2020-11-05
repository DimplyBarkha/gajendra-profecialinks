
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'soundstore',
    nextLinkSelector: 'a[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="instant-search-results-container"]',
    noResultsXPath: '//div[@class="no-result"]',
    openSearchDefinition: null,
    domain: 'soundstore.ie',
    zipcode: '',
  },
};
