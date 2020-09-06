
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#js-product-tile-list',
    noResultsXPath: '//div[@class="search-no-results"]',
    openSearchDefinition: null,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
