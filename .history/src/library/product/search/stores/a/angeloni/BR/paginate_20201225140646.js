
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BR',
    store: 'angeloni',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="paginacao"]/a[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//a[@class="disabled-paginacao"]',
    stopConditionSelectorOrXpath: 'null',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
};
