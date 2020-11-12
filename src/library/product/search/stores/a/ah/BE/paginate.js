
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
      template: 'https://www.ah.be/zoeken?query={searchTerms}&page={page}',
    },
    domain: 'ah.be',
    zipcode: '',
  },
};
