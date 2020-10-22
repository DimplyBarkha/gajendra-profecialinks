
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'vons',
    nextLinkSelector: 'document.querySelector',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#search-grid_0 > div.col-12.bloom-load-wrapper > button',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'vons.com',
    zipcode: '',
  },
};
