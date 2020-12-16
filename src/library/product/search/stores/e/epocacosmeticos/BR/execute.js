module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    domain: 'epocacosmeticos.com',
    url: 'https://www.epocacosmeticos.com.br/pesquisa?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="searchrr__buscaVazia"]',
    zipcode: '',
  },
};
