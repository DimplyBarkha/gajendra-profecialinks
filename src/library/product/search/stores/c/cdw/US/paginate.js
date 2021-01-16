
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'cdw',
    //nextLinkSelector: 'a[aria-label="Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-results>div.search-result',
    noResultsXPath: '//div[@class="no-results-error-message"]',
    openSearchDefinition: null,
    domain: 'cdw.com',
    zipcode: '',
  },
};
