
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'hemkop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class, "ax-search-result-cant-find")]',
    openSearchDefinition: null,
    domain: 'hemkop.se',
    zipcode: '',
  },
};
