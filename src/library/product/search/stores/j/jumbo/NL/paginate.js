
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[analytics-tag="product list"]',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]',
    openSearchDefinition: null,
    domain: 'jumbo.com',
    zipcode: '',
  },
};
