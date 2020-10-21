
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    nextLinkSelector: 'li[class="pagination-next ng-scope"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.frameProductList',
    noResultsXPath: '//p[contains(.,"Aucun résultat ne correspond à votre recherche")]',
    openSearchDefinition: {
      template: 'https://www.procie.com/resultats-de-recherche.html?Search={searchTerms}',
    },
    domain: 'procie.com',
    zipcode: '',
  },
};
