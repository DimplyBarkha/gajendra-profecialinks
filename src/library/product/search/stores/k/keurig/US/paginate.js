
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    nextLinkSelector: 'a[aria-label="Next Arrow"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.top_content img',
    noResultsXPath: '//div[@class="search-result-heading-empty"]',
    openSearchDefinition: null,
    domain: 'keurig.com',
    zipcode: '',
  },
};
