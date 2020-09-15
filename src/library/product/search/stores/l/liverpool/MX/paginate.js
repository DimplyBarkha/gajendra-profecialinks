
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    // nextLinkSelector: 'ul.pagination li.page-item a i.icon-arrow_right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="o-listing__products"]',
    noResultsXPath: '//div[contains(@class , "o-content__noResults")]',
    openSearchDefinition: {
      template: 'https://www.liverpool.com.mx/tienda?s={searchTerms}?page-{page}',
    },
    domain: 'liverpool.com.mx',
    zipcode: '',
  },
};
