
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    nextLinkSelector: 'a[class*="js-pagination-next-button pagination-button__next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="page-category__products-cards"]',
    noResultsXPath: '//h3[@class="page-category__search"]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'kalamazoo.es',
  },
};
