
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    nextLinkSelector: 'button.bv-content-btn-pages-load-more',
    mutationSelector: null,
    spinnerSelector: 'div.bv-mbox-spinner',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'totalwine.com',
    zipcode: '',
  },
};
