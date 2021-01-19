
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'zonasul',
    nextLinkSelector: 'div.vtex-search-result-3-x-buttonShowMore button',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.vtex-flex-layout-0-x-flexRow--productListDesktop',
    loadedXpath: null,
    noResultsXPath: '//h2[contains(text(),"Desculpe, não encontramos nenhum resultado para")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zonasul.com.br',
    zipcode: "''",
  },
};
