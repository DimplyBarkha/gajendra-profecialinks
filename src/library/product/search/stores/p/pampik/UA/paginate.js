
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    nextLinkSelector: 'li.pagination__arrow--right > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#products-list > li.listing__item',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'pampik.com',
    zipcode: '',
  },
};
