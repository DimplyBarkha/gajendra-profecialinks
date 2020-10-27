
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ralphs_92201',
    domain: 'ralphs.com',
    url: 'https://www.ralphs.com/search?query={searchTerms}&searchType=default_search&fulfillment=all',
    loadedSelector: '.PaginateItems',
    noResultsXPath: "//p[@class='no-query-results heading-l font-medium mt-0']",
    zipcode: '',
  },
};
