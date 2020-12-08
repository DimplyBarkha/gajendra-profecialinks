
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'drogariaSaoPaulo',
    domain: 'drogariasaopaulo.com.br',
    url: 'https://www.drogariasaopaulo.com.br/pesquisa?q={searchTerms}',
    loadedSelector: 'div.container-prateleira div.resultItemsWrapper div.chaordic-search-list ul li',
    noResultsXPath: '//div[contains(@class, "rnk-componente-title")]//h1[contains(., "Nenhum Resultado Encontrado")]',
    zipcode: '',
  },
};
