
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GR',
    store: 'hondoscenter',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: '.content-area.main-content',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // {
      // template: 'https://www.hondoscenter.com/en/apotelesmata-proionton/p{page}/?search-for={searchTerms}',
      // },
    domain: 'hondoscenter.com',
    zipcode: '',
  },
};
