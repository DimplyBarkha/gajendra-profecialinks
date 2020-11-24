
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    nextLinkSelector: null,
    // nextLinkSelector: 'button[data-auto="show-more"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'beru.ru',
    zipcode: '',
  },
};
