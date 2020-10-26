
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'vons',
    nextLinkSelector: '.primary-btn.btn.btn-default.btn-secondary.bloom-load-button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#search-grid_0 > div.row.gutters-items-v2.grid-wrapper.product-grid-v2 > product-item-v2',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'vons.com',
    zipcode: '',
  },
};
