
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'JP',
    store: 'qoo10',
    nextLinkSelector: 'div.review_summary div.pagingInfo a.next',
    nextLinkXpath: '//div[@class="review_summary"]//div[@class="pagingInfo"]//a[@class="next"]',
    mutationSelector: 'div.review_summary ul#reviews_wrapper',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'qoo10.jp',
    zipcode: '',
  },
};
