
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'rozetka',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="pagination"]/a[contains(@class,"pagination__direction_type_forward")]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.wrapper, central-wrapper, js-wrapper>div.layout',
    loadedXpath: null,
    noResultsXPath: '//div[@class="search-nothing__wrap"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'rozetka.com.ua',
    zipcode: '',
  },
};
