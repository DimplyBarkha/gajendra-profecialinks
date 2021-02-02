
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="page-category__products-cards"] article',
    noResultsXPath: '//header[@class="search-noresult my-3"]/h3/text()|//ol[@class="page-breadcrumb"]//span[@class="js-dropdown-button"]',
    openSearchDefinition: {
      pageStartNb: 0,
      template: 'https://www.jpg.fr/INTERSHOP/web/WFS/RAJA-JPG-Site/fr_FR/-/EUR/ViewParametricSearch-ProductPaging?PageNumber={page}&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm={searchTerms}',
      },
    domain: 'jpg.fr',
    zipcode: '',
  },
};
