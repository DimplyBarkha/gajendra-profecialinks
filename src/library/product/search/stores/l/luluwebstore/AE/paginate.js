
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AE',
    store: 'LuluWebstore',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="pagination"]//a[@rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'ul[class="product__listing product__grid col-xs-12"] div[class="col-lg-3 col-md-4 col-sm-6 col-xs-6 plp-product-div js-owl-carousel-reference "]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
};
