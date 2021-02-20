
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    nextLinkSelector: '.pagination-widget__show-more-btn',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.catalog-product img',
    noResultsXPath: "//h4[contains(@class, 'empty-search-results__container-header')]",
    openSearchDefinition: null,
    domain: 'dns-shop.ru',
    zipcode: '',
  },
};
