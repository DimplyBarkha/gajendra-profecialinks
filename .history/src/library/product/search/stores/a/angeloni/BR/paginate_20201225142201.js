
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
      offset: 24,
      template: 'https://www.angeloni.com.br/super/busca?Nrpp=12&Ntt={searchTerms}'
    },
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
};
