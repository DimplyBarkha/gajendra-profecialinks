
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'KO',
    store: 'coupang',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//button[contains(@class,"sdp-review__article__page__next--active")]',
    mutationSelector: 'section.js_reviewArticleListContainer',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//section[@class="js_reviewArticleListContainer"]',
    noResultsXPath: '//h3[contains(@class,"error-img")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'coupang.com',
    zipcode: '',
  },
};
