
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
      template: 'https://www.angeloni.com.br/super/busca?No={offset}&Nr=AND%28product.store%3A14%2Cproduct.siteId%3Asuper%2Cprop.product.indexableSuper%3A1%2CNOT%28dim.product.type%3Aproduct-recipe%29%29&Nrpp=12&Ntt={searchTerms}',
    },
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
};
