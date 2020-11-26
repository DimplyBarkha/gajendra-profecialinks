
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'sanalmarket',
    nextLinkSelector: 'li.pag-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.product-card-image.lozad',
    noResultsXPath: '//div[@class="empty-search-state"]//span[@class="empty-search-message"]',
    openSearchDefinition: null,
    domain: 'migros.com.tr',
    zipcode: '',
  },
};
