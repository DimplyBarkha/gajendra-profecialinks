
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    nextLinkSelector: 'li.cw-pagination__list-item a.cw-pagination__next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[data-list-type="search-results"]',
    noResultsXPath: '//h1[@class="cw-type__body cw-padding--none"]',
    openSearchDefinition: null,
    domain: 'chewy.com',
    zipcode: '',
  },
};
