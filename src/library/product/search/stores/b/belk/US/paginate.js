
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'belk',
    nextLinkSelector: 'a.page-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id="search-result-items"], h1[class="search-result-data"]',
    noResultsXPath: '//h1[@class="search-result-data"]',
    openSearchDefinition: null,
    domain: 'belk.com',
    zipcode: '',
  },
};
