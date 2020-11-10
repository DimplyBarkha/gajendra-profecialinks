
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    nextLinkSelector: 'div.pager-item.pagination > a:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.wrapper img',
    noResultsXPath: '//h1[contains(., "Lo sentimos")]',
    openSearchDefinition: null,
    domain: 'bebitus.es',
    zipcode: '',
  },
};
