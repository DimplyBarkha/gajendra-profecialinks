
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'connexion',
    domain: 'connexion.fr',
    url: 'https://www.connexion.fr/recherche/?srch={searchTerms}',
    loadedSelector: 'div[class="result-counter"]',
    noResultsXPath: '//div[@class="container"]/h2[contains(text(),"Oups !")]',
    zipcode: '',
  },
};
