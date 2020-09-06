
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    nextLinkSelector: 'a[title~="Следующие"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'onlinetrade.ru',
    zipcode: '',
  },
};
