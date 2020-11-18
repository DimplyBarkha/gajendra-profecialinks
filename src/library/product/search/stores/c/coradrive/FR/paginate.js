
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="grille"] > div[class*="col1"]  a[class*="picture"]',
    noResultsXPath: '//h2[contains(text(),"Aucun résultat n’a été trouvé")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'coradrive.fr',
    zipcode: '',
  },
};
