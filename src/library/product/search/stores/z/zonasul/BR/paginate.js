
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'zonasul',
    nextLinkSelector: 'div.bt_load',
    nextLinkXpath: null,
    mutationSelector: 'div.content_vitrine',
    spinnerSelector: null,
    loadedSelector: 'div.container_vitrine_lista div.item_vitrine',
    loadedXpath: null,
    noResultsXPath: '//h2[contains(text(),"Desculpe, não encontramos nenhum resultado para")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zonasul.com.br',
    zipcode: "''",
  },
};
