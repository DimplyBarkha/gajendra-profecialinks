
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    nextLinkSelector: 'a.next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: '#progress_bar_dialog[style*="block"]',
    loadedSelector: 'div#grid',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'tractorsupply.com',
    zipcode: '',
  },
};
