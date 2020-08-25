
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    domain: 'procie.com',
    url: 'https://www.procie.com/resultats-de-recherche.html?Search={searchTerms}',
    loadedSelector: 'div.frameProductList',
    noResultsXPath: '//p[contains(.,"Aucun résultat ne correspond à votre recherche")]',
    zipcode: '',
  },
};
