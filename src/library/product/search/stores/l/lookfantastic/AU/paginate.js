
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'lookfantastic',
    nextLinkSelector: null,//'div[class="responsiveProductListPage_topPagination"] ul[class="responsivePageSelectors"] li button[class="responsivePaginationNavigationButton paginationNavigationButtonNext"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',//"li[class*='productListProducts_product'] , div.noresults",
    noResultsXPath: '//div[@class="noresults"]',
    domain: 'lookfantastic.com.au',
    zipcode: '',
    openSearchDefinition: {
      template: 'https://www.lookfantastic.com.au/elysium.search?search={searchTerms}&pageNumber={page}',
    },
  },
};
