
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'newpharma',
    nextLinkSelector: '.next>a',
    nextLinkXpath: null, // '(//a[@id="page_bottom_next_2"])[1]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body[data-view]',
    loadedXpath: '//body[@data-view]',
    noResultsXPath: '//span[@class="gtm-search-no-results"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'newpharma.nl',
    zipcode: "''",
  },
};
