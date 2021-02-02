
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'bernard',
    domain: 'bernard.fr',
    url: 'https://www.bernard.fr/INTERSHOP/web/WFS/RAJA-BERNARDFR-Site/fr_FR/-/EUR/ViewParametricSearch-ProductPaging?PageNumber=0&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
