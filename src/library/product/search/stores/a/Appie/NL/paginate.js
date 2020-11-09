
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'Appie',
    nextLinkSelector: '#start-of-content > div.f-load-more > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@data-testhook,"search-no-results")]',
    openSearchDefinition: null,
    domain: 'appie.nl',
    zipcode: '',
  },
};
