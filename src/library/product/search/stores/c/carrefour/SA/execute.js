
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'carrefour',
    domain: 'carrefourksa.com',
    url: 'https://www.carrefourksa.com/mafsau/en/v1/search={searchTerms}',
    loadedSelector: 'div[class*="-jyyiad"]',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    zipcode: "''",
  },
};
