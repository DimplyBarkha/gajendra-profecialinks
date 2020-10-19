
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    nextLinkSelector: 'a.js-pagination-next-button.pagination-button__next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section article',
    noResultsXPath: '//h3[@class="page-category__search"]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'kalamazoo.es',
  },
};
