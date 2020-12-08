
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    loadedSelector: 'div#toolbar__all_anchor',
    openSearchDefinition: {
      template: 'https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}&SearchParameter=%26%40QueryTerm%3D{searchTerms}%26MasterProductFlag%3D0%26SpecialProductFlag%3Dfalse#toolbar__all_anchor',
    },
    noResultsXPath: "//ul[@class='search-noresult__list']/li",
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
