
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'telemercados',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.page',
    loadedXpath: null,
    noResultsXPath: '//div[@class="busqueda-vacia-wrapper"]//h2[contains(text(),"No encontramos resultados para tu búsqueda")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'telemercados.cl',
    zipcode: '',
  },
};
