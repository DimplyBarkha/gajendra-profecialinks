
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'holtrenfrew',
    nextLinkSelector: 'li[class="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li[class="pagination-next"]',
    noResultsXPath: '//div[@class="search-empty"]/div',
    openSearchDefinition: null,
    domain: 'holtrenfrew.com',
    zipcode: '',
  },
};
