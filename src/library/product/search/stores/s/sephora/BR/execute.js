
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    domain: 'sephora.com.br',
    url: "https://pesquisa.sephora.com.br/busca?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: "//div[@class='nm-not-found-message']",
    zipcode: '',
  },
};
