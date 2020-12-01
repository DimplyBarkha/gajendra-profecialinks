
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.linio.com.pe/search?scroll=&q={searchTerms}&page={page}',
    },
    domain: 'linio.com',
    zipcode: '',
  },
};
