
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'solucious',
    nextLinkSelector: null,
    nextLinkXpath: '//ul[@class="pagination"]/li/a[@class="last"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.container.main',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"ajax_content_container") and contains(@class,"no-results")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'solucious.be',
    zipcode: '',
  },
};
