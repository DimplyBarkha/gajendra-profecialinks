
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    nextLinkSelector: '[data-auto="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: '.oVTSBGkD1W',
    loadedSelector: '#page-i8alls7xtma',
    noResultsXPath: 'boolean(not(//div[@data-auto="pagination-next"]))',
    openSearchDefinition: null,
    domain: 'beru.ru',
    zipcode: '',
  },
};
