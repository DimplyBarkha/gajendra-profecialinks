
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    domain: 'carrefour.es',
    url: 'https://www.carrefour.es/?q={searchTerms}',
    loadedSelector: "section[id='ebx-grid']",
    noResultsXPath: "//font[contains(text(),'Aucun résultat trouvé, veuillez modifier les termes de votre recherche.')]",
    zipcode: '',
  },
};
