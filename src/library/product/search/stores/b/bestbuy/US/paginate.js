
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    nextLinkSelector: 'a.sku-list-page-next:not(.disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li.sku-item[data-sku-id]',
    noResultsXPath: '//h3[@class="no-results-message"]',
    openSearchDefinition: null,
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
