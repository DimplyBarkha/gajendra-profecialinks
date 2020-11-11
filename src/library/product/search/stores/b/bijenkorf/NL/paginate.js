
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    nextLinkSelector: 'div[class="load-more-button"]>a',
    mutationSelector: null,
    spinnerSelector: 'div[data-testid="Loading"]',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'bijenkorf.nl',
    zipcode: '',
  },
};
