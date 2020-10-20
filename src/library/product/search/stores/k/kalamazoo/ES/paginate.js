
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    nextLinkSelector: 'a.pagination-button__next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section article',
    noResultsXPath: '//h3[@class="page-category__search"]',
    openSearchDefinition: {
      pageOffset: 1,
      template: 'https://www.kalamazoo.es/INTERSHOP/web/WFS/RAJA-KALAMAZOO-Site/es_ES/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
    },
    zipcode: '',
    domain: 'kalamazoo.es',
  },
};
