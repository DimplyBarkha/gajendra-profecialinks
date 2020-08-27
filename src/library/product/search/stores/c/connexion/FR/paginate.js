
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'connexion',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="result-counter"]',
    openSearchDefinition: {
      template: 'https://www.connexion.fr/recherche/?srch={searchTerms}&p={page}',
    },
    noResultsXPath: '//div[@class="container"]/h2[contains(text(),"Oups !")]',
    domain: 'connexion.fr',
    zipcode: '',
  },
};
