module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'nfm',
    nextLinkSelector: 'ul.pagination-ap.pagination a.no-padding-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//p[contains(text(), 'No Results Found')]",
    openSearchDefinition: null,
    domain: 'nfm.com',
    zipcode: '',
  },
};
