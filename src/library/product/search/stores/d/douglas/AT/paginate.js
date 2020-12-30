
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '',
    noResultsXPath: null, 
    openSearchDefinition: {
      template: 'https://www.douglas.at/de/search?q={searchTerms}&page={page}',
    },
    domain: 'douglas.at',
    zipcode: '',
  },
};
