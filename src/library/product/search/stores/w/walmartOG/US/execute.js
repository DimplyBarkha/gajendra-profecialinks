
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    domain: 'walmart.com/grocery',
    url: 'https://grocery.walmart.com/search/?query={searchTerms}',
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"]',
    noResultsXPath: '//div[@data-automation-id="productsListPage"]//*[@data-automation-id="noResultsSearchTerm"]',
  },
};
