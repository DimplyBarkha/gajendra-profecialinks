
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    // nextLinkSelector: 'button[class="btn btn-primary hidden-sm-down"]',
    // nextLinkXpath: '//button[@ng-click="buscaxPaginaSig(pagActual)"][2]',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: '#product_list',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.lacomer.com.mx/lacomer/goBusqueda.action?succId=287&ver=mislistas&succFmt=100&criterio={searchTerms}#/{searchTerms}-/p={page}',
    //   },
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
};
