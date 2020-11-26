
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: 'div.cdk-overlay-container',
    loadedSelector: 'div.product-grid-component.search',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'migros.ch',
    zipcode: '',
  },
};
