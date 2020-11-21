
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'sightful',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@id="amasty-shopby-product-list"]//div[contains(@class,"toolbar-products")][2]//li[@class="item pages-item-next"]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#amasty-shopby-product-list',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'sightful.nl',
    zipcode: "''",
  },
};
