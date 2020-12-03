
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    nextLinkSelector: 'a[class="js-pagination-next-button pagination-button__next "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'jpg.fr',
    zipcode: '',
  },
};
