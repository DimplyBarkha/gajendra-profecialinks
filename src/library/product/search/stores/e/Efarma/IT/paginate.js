
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    //template: null,
    country: 'IT',
    store: 'Efarma',
    //nextLinkSelector: 'div.clerk-load-more-button',
    //nextLinkXpath: null,
    //mutationSelector: 'div.clerk-load-more-button',
    //spinnerSelector: 'div.clerk-load-more-button',
    loadedSelector: 'ol.clerk-grid.products-list',
    //loadedXpath: null,
    noResultsXPath: '//strong[contains(text(),"La tua ricerca non ha dato risultati ma NON ARRENDERTI!")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'efarma.com',
    zipcode: '',
  },
};
