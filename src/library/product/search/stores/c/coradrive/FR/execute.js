
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    domain: 'coradrive.fr',
    url: 'https://www.coradrive.fr/arcueil/rechercher.html?searchquery={searchTerms}',
    loadedSelector: 'div[class*="grille"] > div[class*="col1"]  a[class*="picture"]',
    noResultsXPath: '//h2[contains(text(),"Aucun résultat n’a été trouvé")]',
    zipcode: '',
  },
};
