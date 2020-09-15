
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    domain: 'liverpool.com.mx',
    url: 'https://www.liverpool.com.mx/tienda?s={searchTerms}',
    loadedSelector: 'div[class="o-listing__products"]',
    noResultsXPath: '//div[contains(@class , "o-content__noResults")]',
    zipcode: '',
  },
};
