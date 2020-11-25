
module.exports = {
  // implements: 'product/reviews/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    // nextLinkSelector: 'button.bv-content-btn',
    nextLinkSelector: null,
    mutationSelector: null,
    // spinnerSelector: 'div.bv-mbox-spinner',
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'totalwine.com',
    zipcode: '',
  },
};
