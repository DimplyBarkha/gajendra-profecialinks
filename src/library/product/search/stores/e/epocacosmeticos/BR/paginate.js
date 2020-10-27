
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    nextLinkSelector: 'a.paginacao__next.next',
    mutationSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="searchrr__buscaVazia"]',
    openSearchDefinition: null,
    domain: 'epocacosmeticos.com',
    zipcode: '',
  },
};
