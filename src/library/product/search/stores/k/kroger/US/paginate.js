module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    // loadedSelector: '.PaginateItems, p[class*="no-query-results"]',
    loadedSelector: '.PaginateItems',
    // nextLinkSelector: 'li.Pagination-item.Pagination-next a',
    // noResultsXpath: '//p[contains(@class,"no-query-results")]',
    // noResultsXpath: '//label[contains(@class,"kds-LoadingSpinner")]',
    noResultsXpath: 'count(//div[contains(@class,"AutoGrid-cell")])=0',
    openSearchDefinition: {
      template: 'https://www.kroger.com/pl/all/00?fulfillment=all&query={searchTerms}&page={page}&searchType=natural',
    },
    domain: 'kroger.com',
  },
};
