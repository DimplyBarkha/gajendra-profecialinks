
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-testhook="search-lane"]',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.ah.be/zoeken/api/products/search?page=1&size=36&query={SearchTerms}',
    },
    domain: 'ah.be',
    zipcode: '',
  },
};
