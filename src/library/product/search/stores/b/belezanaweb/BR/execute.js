
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    domain: 'belezanaweb.com.br',
    url: "https://www.belezanaweb.com.br/busca?q={searchTerms}",
    loadedSelector: "div[class='showcase-gondola'] a[class='showcase-item-image '] img",
    noResultsXPath: "//h1[@class='content-page-title content-page-title-list' and contains(.,'não possui resultados')]",
    zipcode: '',
  },
};
