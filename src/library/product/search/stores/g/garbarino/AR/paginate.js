
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AR',
    store: 'garbarino',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: null,
    loadedSelector: 'div.itemList',
    noResultsXPath: '//h2[@class="gb-error-title" and text()="No hay resultados para esta búsqueda"]',
    loadedXpath: null,
    // noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.garbarino.com/q/{searchTerms}/srch?page={page}',
    },
    domain: 'garbarino.com',
    zipcode: '',
  },
};
