
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="toolbar-bottom"]//div[@class="pages"]//li[@class="next"]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.main-container, col2-left-layout',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'electronic4you.at',
    zipcode: '',
  },
};
