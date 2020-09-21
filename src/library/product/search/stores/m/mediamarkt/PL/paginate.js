
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    nextLinkSelector: 'div.b-listing_toolBarPagination a.m-pagination_next',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'div.m-offerBox',
    noResultsXPath: '//div[contains(@class, "s-search_empty")]',
    openSearchDefinition: null,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
