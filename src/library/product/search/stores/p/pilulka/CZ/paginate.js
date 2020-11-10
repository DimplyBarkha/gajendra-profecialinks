
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'pilulka',
    nextLinkSelector: 'li.pagination__item i',
    mutationSelector: null,
    spinnerSelector: 'body.loader',
    loadedSelector: 'a.product-prev__img',
    noResultsXPath: '//div[@class="alert alert-danger"]//div[contains(text(), "žádné")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pilulka.cz',
    zipcode: '',
  },
};
