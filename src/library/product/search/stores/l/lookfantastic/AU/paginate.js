
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'lookfantastic',
    nextLinkSelector: '#mainContent > div.responsiveProductListPage_bottomPagination > nav > ul > li:nth-child(6) > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "li[class*='productListProducts_product'] , div.noresults",
    noResultsXPath: null,
    domain: 'lookfantastic.com.au',
    zipcode: '',
    // openSearchDefinition: {
    //   template: 'https://www.lookfantastic.com.au/elysium.search?search={searchTerms}&pageNumber={page}',
    // },
  },
};
