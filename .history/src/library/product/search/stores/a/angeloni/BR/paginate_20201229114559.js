
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
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.angeloni.com.br/super/busca?Nrpp=150&Ntt={searchTerms}',
    },
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
};
