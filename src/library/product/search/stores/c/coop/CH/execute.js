
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'coop',
    domain: 'coop.ch',
    url: 'https://www.coop.ch/fr/search/?text={searchTerms}',
    loadedSelector: 'ul.list-page__content li',
    noResultsXPath: '//h1[contains(text(),"Aucun résultat trouvé")]',
    zipcode: "''",
  },
};
