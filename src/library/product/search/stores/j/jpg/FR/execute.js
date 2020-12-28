
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    url: "https://www.jpg.fr/INTERSHOP/web/WFS/RAJA-JPG-Site/fr_FR/-/EUR/ViewParametricSearch-SimpleOfferSearch?PageNumber=0&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}&SearchParameter=",   
    loadedSelector: 'body',
    noResultsXPath: '//header[@class="search-noresult my-3"]/h3/text()',
    zipcode: '',
  },
};
