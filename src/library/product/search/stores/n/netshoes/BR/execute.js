
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'netshoes',
    domain: 'netshoes.com.br',
    url: 'https://www.netshoes.com.br/busca?q={searchTerms}',
    loadedSelector: 'section.search-list',
    noResultsXPath: '//div[contains(@class, "no-results")]//h2[contains(text(), "Não foi possível encontrar resultados para o termo procurado")]',
    zipcode: "''",
  },
};
