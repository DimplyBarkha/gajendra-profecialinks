module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    domain: 'migros.ch',
    url: 'https://shop.migros.ch/en/search?query={searchTerms}',
    loadedSelector: 'div.product-grid-component.search',
    noResultsXPath: "//p[@class='info-message ng-star-inserted']/text()",
  },
};
