
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'technopark',
    nextLinkSelector: 'div.listing__footer div.listing__pagination.js-data--listing.js-pagination > a.listing__pagination-arrow.js-page.listing__pagination-arrow--right:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'technopark.ru',
    zipcode: '',
  },
};
