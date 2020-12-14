
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    domain: 'mondoffice.com',
    url: 'https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageSize=9999&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
    loadedSelector: 'div#toolbar__all_anchor',
    noResultsXPath: "//ul[@class='search-noresult__list']/li",
    zipcode: '',
  },
};
