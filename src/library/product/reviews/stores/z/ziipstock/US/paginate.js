
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'ziipstock',
    nextLinkSelector: null,
    nextLinkXpath: '//li[@class="next"]/a',
    mutationSelector: 'div.stamped-review',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'ziipstock.com',
    zipcode: "''",
  },
};
