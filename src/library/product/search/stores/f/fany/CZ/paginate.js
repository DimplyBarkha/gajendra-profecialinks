
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    nextLinkSelector: 'ul.pagination>li:last-child>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.category-products',
    noResultsXPath: '//div[@class="alert alert-info"]',
    openSearchDefinition: null,
    domain: 'fany.cz',
    zipcode: '',
  },
};
