
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'drogariasaopaulo',
    domain: 'drogariasaopaulo.com.br',
    url: 'https://www.drogariasaopaulo.com.br/pesquisa?q={searchTerms}',
    loadedSelector: 'div[class*="vitrine resultItemsWrapper"] li',
    noResultsXPath: '//h1[text()[contains(.,"Nenhum Resultado Encontrado!")]]',
    zipcode: '',
  },
};
