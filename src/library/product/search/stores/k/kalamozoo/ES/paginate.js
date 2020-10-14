
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'kalamozoo',
    nextLinkSelector: 'span[scvalue="pagination: next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="ResultsSection"]',
    noResultsXPath: '//div[contains(@class,"NoSearchResults")]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'kalamozoo.es',
  },
};
