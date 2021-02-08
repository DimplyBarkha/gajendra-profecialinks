
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'restockit',
    nextLinkSelector: '#ctl00_SearchBody_NavigationTop_lnkNext',
    loadedSelector: '#hawkitemlist',
    noResultsXPath: '//div[contains(@class, "zero-results")]//h1[@id="pageHeading"][contains(text(), "0 Products")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'restockit.com',
    zipcode: '',
  },
};
