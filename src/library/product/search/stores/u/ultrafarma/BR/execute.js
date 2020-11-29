
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'ultrafarma',
    domain: 'ultrafarma.com.br',
    url: 'https://www.ultrafarma.com.br/busca?q={searchTerms}',
    loadedSelector: 'div#container',
    noResultsXPath: '//section[contains(@class,"erros")]//p[contains(text(),"Nenhum resultado encontrado para")]',
    zipcode: "''",
  },
};
