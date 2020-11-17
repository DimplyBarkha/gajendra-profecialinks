module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product-list.results-container.do-flex.list',
    noResultsXPath: '//ul[contains(@class,"no-results")]',
    openSearchDefinition: null,
    domain: 'hepsiburada.com',
    zipcode: '',
  },
};
