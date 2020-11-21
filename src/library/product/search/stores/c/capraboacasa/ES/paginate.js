
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'capraboacasa',
    nextLinkSelector: null,
    nextLinkXpath: '//li[@class!="disabled"]/a[@data-next="true"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="product col s6 m3 l3 small-product "]',
    noResultsXPath: '//span[@cantidad="0"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'capraboacasa.com',
    zipcode: "''",
  },
};
