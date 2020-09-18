
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    nextLinkSelector: 'ul.pagination li:nth-last-child(2) a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="o-listing__products"]',
    noResultsXPath: '//div[contains(@class , "o-content__noResults")] | //div[@class="container o-product__mainContainer"]',
    // openSearchDefinition: {
    //   // template: 'https://www.liverpool.com.mx/tienda?s={searchTerms}?page-{page}',
    //   template: 'https://www.liverpool.com.mx/tienda/page-{page}?s={searchTerms}',
    // },
    domain: 'liverpool.com.mx',
    zipcode: '',
  },
};
