
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'pinalli',
    nextLinkSelector: 'a[aria-label="Next"]',
    loadedSelector: null,
    noResultsXPath: '//div[@data-uk-rr-algolia="no-results"]/div[contains(text(),"Nessun")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pinalli.it',
    zipcode: '',
  },
};
