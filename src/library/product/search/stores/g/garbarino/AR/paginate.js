
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AR',
    store: 'garbarino',
    nextLinkSelector: null,
    nextLinkXpath: '//ul[@class="pagination"]/li[@class="pagination__page"]/a[@rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: null,
    loadedSelector: 'div.itemList div.col-xs-12.col-sm-4.col-md-3',
    noResultsXPath: '//h2[@class="gb-error-title" and text()="No hay resultados para esta búsqueda"]',
    loadedXpath: null,
    // noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'garbarino.com',
    zipcode: '',
  },
};
