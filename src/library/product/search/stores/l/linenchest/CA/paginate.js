
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    nextLinkSelector: 'li.ais-Pagination-item.ais-Pagination-item--nextPage a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.ais-Hits-list li.ais-Hits-item',
    noResultsXPath: '(//div[@id="instant-empty-results-container"]//div[@class="no-results"]//div)[1]',
    openSearchDefinition: null,
    domain: 'linenchest.com',
    zipcode: '',
  },
};
