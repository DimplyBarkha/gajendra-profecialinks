
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#shelf-loop > div.catalog-list-item',
    noResultsXPath: '//div[@class="empty-page"]',
    openSearchDefinition: null,
    domain: 'petlove.com.br',
    zipcode: '',
  },
};
