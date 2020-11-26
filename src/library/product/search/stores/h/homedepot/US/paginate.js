
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.results-wrapped',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.homedepot.com/s/{searchTerms}?NCNI-5&Nao={offset}',
    },
    domain: 'homedepot.com',
    zipcode: '',
  },
};
