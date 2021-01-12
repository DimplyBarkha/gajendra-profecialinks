
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    nextLinkSelector: 'li[class*="pagination__nav-item--last"] a',
    spinnerSelector: null,
    loadedSelector: '.tm-search-results__container',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'trademe.co.nz',
    zipcode: "''",
  },
};
