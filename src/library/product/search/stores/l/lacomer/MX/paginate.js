
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    // nextLinkSelector: 'button[class="btn btn-primary hidden-md-up btn-arrow-right-mobile"]',
    // nextLinkXpath: '//button[@ng-click="buscaxPaginaSig(pagActual)"][2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.lacomer.com.mx/lacomer/goBusqueda.action?succId=287&ver=mislistas&succFmt=100&criterio=cereal+avena#/cereal%20avena-/p={page}',
      },
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
};
