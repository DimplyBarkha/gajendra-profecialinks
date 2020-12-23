
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'bestbuy',
    nextLinkSelector: null, // 'div.page-pagination > div > div > div:nth-child(2) > ul > li.page.next > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null, // 'div.pl-page-content',
    noResultsXPath: '//h3[@class="no-results-message"]',
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
