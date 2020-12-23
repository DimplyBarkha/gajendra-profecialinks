
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CH',
    store: 'nesspresso_ch_fr',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class=ProductListGroup]',
    noResultsXPath: '//h2[contains(.,"0 ACCESSOIRES")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
