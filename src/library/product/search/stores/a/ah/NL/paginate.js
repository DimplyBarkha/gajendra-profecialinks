
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article[data-testhook="product-card"] img',
    noResultsXPath: '//div[@data-testhook="search-no-results"]',
    openSearchDefinition: null,
    domain: 'ah.nl',
    zipcode: '',
  },
};
