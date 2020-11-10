
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.amazon.sa/s?k={searchTerms}&page={page}&language=en',
    },
    domain: 'amazon.sa',
    zipcode: '',
  },
};
