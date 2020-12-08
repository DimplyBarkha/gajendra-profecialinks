
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    url: 'https://www.walmart.ca/search?q={searchTerms}',
    loadedSelector: 'div#product-results div[data-automation="product"]',
    noResultsXPath: '//h1[@data-automation="null-results-message"]',
    zipcode: "''",
  },
};
