
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    // nextLinkSelector: 'a.pagination-button__next',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div#toolbar__all_anchor',
    openSearchDefinition: {
      template: 'https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
    },
    noResultsXPath: "//ul[@class='search-noresult__list']/li",
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
