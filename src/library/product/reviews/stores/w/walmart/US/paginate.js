
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    nextLinkSelector: 'button.paginator-btn.paginator-btn-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'walmart.com',
    zipcode: '',
  },
};
