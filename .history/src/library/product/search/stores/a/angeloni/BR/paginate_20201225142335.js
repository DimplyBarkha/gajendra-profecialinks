
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
    noResultsXPath: null,
    stopConditionSelectorOrXpath: '//a[@class="disabled-paginacao"]',
    resultsDivSelector: null,
    openSearchDefinition: {
      offset: 12,
      template: 'https://www.angeloni.com.br/super/busca?Nrpp={offset}&Ntt={searchTerms}'
    },
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
};
