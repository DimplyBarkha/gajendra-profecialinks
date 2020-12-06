
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'farmae_it',
    nextLinkSelector: 'div.toolbar-bottom i.fa.fa-caret-right',
    nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.category-products' ,
    noResultsXPath: '//p[contains(text(),"Non ci sono prodotti corrispondenti alla selezione")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.farmae.it/catalogsearch/result/?cat=0&page={page}&q={searchTerms}',
    },
    domain: 'farmae.it',
    zipcode: '',
  },
};
