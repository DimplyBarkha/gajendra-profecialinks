
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    domain: 'mondoffice.com',
    url: 'https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageNumber=1&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}&SearchParameter=%26%40QueryTerm%3D{searchTerms}%26MasterProductFlag%3D0%26SpecialProductFlag%3Dfalse#toolbar__all_anchor',
    loadedSelector: 'div#toolbar__all_anchor',
    noResultsXPath: "//ul[@class='search-noresult__list']/li",
    zipcode: '',
  },
};
