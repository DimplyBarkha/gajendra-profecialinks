
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'cigaretteelec',
    domain: 'cigaretteelec.fr',
    url: 'https://www.cigaretteelec.fr/recherche?search_query={searchTerms}',
    loadedSelector: 'div[class*="component-product-list"]',
    noResultsXPath: '//*[contains(text(),"Vous ne trouvez pas votre produit?")]',
    zipcode: '',
  },
};
