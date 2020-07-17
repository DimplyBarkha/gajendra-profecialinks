const { implementation } = require('../../kroger/US/sharedSearchExecute');

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger_45044',
    domain: 'kroger.com',
    url: 'https://www.kroger.com/search?query={searchTerms}&searchType=natural&fulfillment=all',
    loadedSelector: '.PaginateItems',
    noResultsXPath: "//p[@class='no-query-results heading-l font-medium mt-0']",
    zipcode: '45044',
  },
  implementation,
};
