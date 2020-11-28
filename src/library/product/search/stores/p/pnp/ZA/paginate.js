
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    nextLinkSelector: 'li[class="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.col-md-12.product-listing.product-grid.product-grid',
    noResultsXPath: '//h3[contains(text(), "Oh dear,")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pnp.co.za',
    zipcode: '',
  },
};
