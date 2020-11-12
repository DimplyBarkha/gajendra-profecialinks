
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'leclerc',
    domain: 'leclercdrive.fr',
    url: 'https://fd1-courses.leclercdrive.fr/magasin-606801-Saint-Louis/recherche.aspx?TexteRecherche={searchTerms}',
    loadedSelector: "div[id*='_ProductsList']",
    noResultsXPath: "//div[contains(@class,'PasDeResultats')",
    zipcode: '',
  },
};
