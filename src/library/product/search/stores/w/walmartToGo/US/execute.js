
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walmartToGo',
    domain: 'grocery.walmart.com',
    url: 'https://walmart.com/grocery/search/?query={searchTerms}',
    // loadedSelector: null,
    // noResultsXPath: null,
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"]',
    noResultsXPath: '//div[@data-automation-id="productsListPage"]//*[@data-automation-id="noResultsSearchTerm"]',
    zipcode: '64145',
  },
};
