
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'mda',
    domain: 'mda-electromenager.com',
    url: 'https://www.mda-electromenager.com/fr/recherche/?q={searchTerms}',
    loadedSelector: 'div[id="articles_resultats"]>div',
    noResultsXPath: '//p[text()="Aucun résultat trouvé"]',
    zipcode: '',
  },
};
