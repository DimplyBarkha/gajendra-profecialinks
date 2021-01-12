
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '',
    noResultsXPath: '//div[contains(@class,"grid search-page search-page--empty")] | //div[@class="grid error-404-component"]', 
    openSearchDefinition: {
      template: 'https://www.douglas.at/de/search?q={searchTerms}&page={page}',
    },
    domain: 'douglas.at',
    zipcode: '',
  },
};
