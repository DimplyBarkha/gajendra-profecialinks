
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'bernard',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition:
    {
      pageStartNb: 0,
      
      template: 'https://www.bernard.fr/INTERSHOP/web/WFS/RAJA-BERNARDFR-Site/fr_FR/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
      },
    domain: 'bernard.fr',
    zipcode: '',
  },
};
