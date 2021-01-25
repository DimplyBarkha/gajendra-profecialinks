
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    nextLinkSelector: 'li.pagination-list-next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.lazy img',
    noResultsXPath: '//div[@class="no-search-result"]//h1',
    openSearchDefinition: null,
    domain: 'elefant.ro',
    zipcode: '',
  },
};
