
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    nextLinkSelector: 'a.ico-pagination-next:not(.disabled)',
    mutationSelector: null,
    spinnerSelector: 'div.ajax-overlay-wrapper[style*="display: none"]',
    loadedSelector: 'div#js-product-tile-list',
    noResultsXPath: '//div[@class="search-no-results"]',
    openSearchDefinition: null,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
