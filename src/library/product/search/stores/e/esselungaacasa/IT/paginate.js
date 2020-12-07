
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'esselungaacasa',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#mainContent',
    loadedXpath: null,
    noResultsXPath: '//div[@ng-if="productSetCtrl.emptyProductSet"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'esselungaacasa.it',
    zipcode: '',
  },
};
