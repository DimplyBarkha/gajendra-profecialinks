const { implementation } = require('./sharedSearchExecute')

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    url: 'https://www.kroger.com/search?query={searchTerms}&searchType=natural&fulfillment=all',
    loadedSelector: '.PaginateItems',
    noResultsXPath: "//p[@class='no-query-results heading-l font-medium mt-0']",
  },
  implementation,
};
