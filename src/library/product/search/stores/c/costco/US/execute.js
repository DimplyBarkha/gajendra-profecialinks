
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    url: 'https://www.costco.com/CatalogSearch?dept=All&keyword={searchTerms}',
    loadedSelector: 'div.product-list.grid',
    noResultsXPath: '//div[@id="no-results"]',
  },
};
