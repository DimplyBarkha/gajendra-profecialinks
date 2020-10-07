
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-et-name]',
    noResultsXPath: '//h1[@class="search-no-hits-headline"]',
    openSearchDefinition: null,
    domain: 'medimax.de',
    zipcode: '',
  },
};
