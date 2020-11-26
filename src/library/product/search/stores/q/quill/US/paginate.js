
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'quill',
    nextLinkSelector: '#Pager > span.scTrack.pager-arrow.next.formLabel',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#SkuPageMainImg',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"notfound-message")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'quill.us',
    zipcode: '',
  },
};
