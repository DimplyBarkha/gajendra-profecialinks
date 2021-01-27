
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    nextLinkSelector: 'a[class="c-pagination__next font-icon icon-up "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-tile"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
