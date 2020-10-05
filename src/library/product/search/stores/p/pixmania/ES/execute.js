
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    domain: 'pixmania.es',
    url: 'https://www.pixmania.es/s?q={searchTerms}',
    loadedXPath: '//div[@product-card="product"]',
    noResultsXPath: '//nav[contains(@class,"catalog-products-nav")]//span[contains(text(),"0 artículos")]',
  },
};
