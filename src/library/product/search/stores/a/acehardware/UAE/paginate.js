
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    nextLinkSelector: 'a[class*="pagination__btn--next"]',
    mutationSelector: null,
    spinnerSelector: 'div.b-loader',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'aceuae.com',
    zipcode: '',
  },
};
