
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.mediamarkt.at/de/search.html?page={page}&query={searchTerms}'
    },
    domain: 'mediamarkt.at',
    zipcode: '',
  },
};
