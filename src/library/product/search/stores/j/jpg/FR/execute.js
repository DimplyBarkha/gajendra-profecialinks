
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    url: "https://www.jpg.fr/INTERSHOP/web/WFS/RAJA-JPG-Site/fr_FR/-/EUR/ViewParametricSearch-ProductPaging?PageNumber=0&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}",   
    loadedSelector: 'section[class="page-category__products-cards"] article',
    noResultsXPath: '//header[@class="search-noresult my-3"]/h3/text()',
    zipcode: '',
  },
};
