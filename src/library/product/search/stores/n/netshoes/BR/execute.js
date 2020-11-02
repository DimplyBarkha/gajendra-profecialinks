
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'netshoes',
    domain: 'netshoes.com.br',
    url: 'https://www.netshoes.com.br/busca?q={searchTerms}',
    loadedSelector: 'section.ff-ajax-price',
    noResultsXPath: '//div[contains(@class,"no-results")]//h2',
    zipcode: "''",
  },
};
