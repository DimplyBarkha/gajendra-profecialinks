
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    domain: 'sephora.com.br',
    url: "https://pesquisa.sephora.com.br/busca?q={searchTerms}",
    loadedSelector: "div.nm-product-img-container > a.product-image >img",
    noResultsXPath: "//div[@class='nm-not-found-message']",
    zipcode: '',
  },
};
