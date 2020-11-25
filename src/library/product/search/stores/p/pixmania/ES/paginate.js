
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    nextLinkXPath: '//li[@ng-if="nextPageHref"]/a',
    loadedXPath: '//div[@class="catalog"]',
    noResultsXPath: '//nav[contains(@class,"catalog-products-nav")]//span[contains(text(),"0 artículos")]',
    domain: 'pixmania.es',
  },
};
