
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//span[@class="g-s-no-results__top-message-heading-text"]',
    openSearchDefinition: null,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
};
