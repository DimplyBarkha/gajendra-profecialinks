
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'auchan',
    nextLinkSelector: '.pagination .active ~ .page > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//h2[@class="search-results"]',
    openSearchDefinition: null,
    domain: 'auchan.pt',
    zipcode: '',
  },
};