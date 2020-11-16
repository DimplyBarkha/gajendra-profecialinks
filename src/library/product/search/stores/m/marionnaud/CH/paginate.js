
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.more-data-loader div.product-tile img.product-tile__image',
    noResultsXPath: '//section[contains(@data-position, "emptySearchResult")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'marionnaud.ch',
    zipcode: '',
  },
};
