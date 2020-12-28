
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: '//header[@class="search-noresult my-3"]/h3/text()',
    openSearchDefinition: {
      template: 'https://www.jpg.fr/INTERSHOP/web/WFS/RAJA-JPG-Site/fr_FR/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}&SearchParameter=',
      },
    domain: 'jpg.fr',
    zipcode: '',
  },
};
