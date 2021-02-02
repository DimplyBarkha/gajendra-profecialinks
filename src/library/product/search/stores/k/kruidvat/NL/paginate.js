
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    domain: 'kruidvat.nl',
    openSearchDefinition: {
      template: 'https://www.kruidvat.nl/search?q={searchTerms}&searchType=manual&page={page}&size=20',
    },
  },
};
