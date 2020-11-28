
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    nextLinkSelector: 'button[data-auto="show-more"]',
    mutationSelector: null,
    spinnerSelector: 'button[data-auto="show-more"] > div',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'beru.ru',
    zipcode: '',
  },
};
