
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'carrefour',
    domain: 'carrefourksa.com',
    url: 'https://www.carrefourksa.com/mafsau/en/v1/search={searchTerms}',
    loadedSelector: 'section.plp-list .plp-list__item',
    noResultsXPath: '//p[@class="not-found__para"]',
    zipcode: "''",
  },
};
