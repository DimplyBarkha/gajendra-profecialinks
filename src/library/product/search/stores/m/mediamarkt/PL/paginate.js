
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    nextLinkSelector: 'div.b-listing_toolBarPagination a.m-pagination_next',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
