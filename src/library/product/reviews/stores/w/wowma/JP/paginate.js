
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'JP',
    store: 'wowma',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//a[@class="stIconMd-keyboard-arrow-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section#lotReviewContents',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"NoResultPage")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'wowma.jp',
    zipcode: '',
  },
};
