
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    // loadedSelector: 'div#toolbar__all_anchor',
    // openSearchDefinition: {
    //   pageStartNb: 0,
    //   template: 'https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=9999&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
    // },
    // noResultsXPath: "//ul[@class='search-noresult__list']/li",
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
