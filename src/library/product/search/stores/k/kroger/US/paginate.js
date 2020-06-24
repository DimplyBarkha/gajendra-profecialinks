module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    loadedSelector: '.PaginateItems, p[class*="no-query-results"]',
    openSearchDefinition: {
      template: 'https://www.kroger.com/pl/all/00?fulfillment=all&query={searchTerms}&page={page}&searchType=natural',
    },
    domain: 'kroger.com',
  },
};
