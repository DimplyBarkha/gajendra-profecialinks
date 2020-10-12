
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    nextLinkXPath: '//li[@ng-if="nextPageHref"]/a',
    loadedXPath: '//div[@product-card="product"]',
    noResultsXPath: '//nav[contains(@class,"catalog-products-nav")]//span[contains(text(),"0 artículos")]',
    domain: 'pixmania.es',
  },
};
