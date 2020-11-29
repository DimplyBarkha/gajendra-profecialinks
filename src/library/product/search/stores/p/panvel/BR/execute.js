
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'panvel',
    domain: 'panvel.com',
    url: 'https://www.panvel.com/panvel/buscarProduto.do?paginaAtual=1&termoPesquisa={searchTerms}',
    loadedSelector: 'div.search-result__products>div',
    noResultsXPath: '//div[@class="search-result--empty"]/div[contains(.,"Nenhum produto encontrado para o termo pesquisado!")]',
    zipcode: '',
  },
};
