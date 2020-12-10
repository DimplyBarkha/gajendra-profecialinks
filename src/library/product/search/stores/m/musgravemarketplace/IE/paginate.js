
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IE',
    store: 'musgravemarketplace',
    nextLinkSelector: 'form[name="pages2"] a[onclick*="next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div#scrim[style*="block"]',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'musgravemarketplace.ie',
    zipcode: '',
  },
};
