
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'dia',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.productgridcontainer .prod_grid',
    // loadedSelector: '.crispImage',
    loadedXpath: null,
    noResultsXPath: '//h2[contains(text(),"No se han encontrado resultados")]',
    // noResultsXPath: '//div[@class="title_holder"]/h2',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'dia.es',
    zipcode: '',
  },
};
