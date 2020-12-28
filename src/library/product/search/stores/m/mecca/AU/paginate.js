
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'mecca',
    nextLinkSelector: 'a[class="page-next"], a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="no-hits-help"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mecca.com.au',
    zipcode: '',
  },
};