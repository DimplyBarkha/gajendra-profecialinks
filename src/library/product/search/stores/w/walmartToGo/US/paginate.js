
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmartToGo',
    nextLinkSelector: 'button[aria-label="next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"],div[data-automation-id="productsListPage"] [data-automation-id="noResultsSearchTerm"]',
    openSearchDefinition: {
      template: 'https://walmart.com/grocery/search/?query={searchTerms}&page={page}',
    },
    domain: 'grocery.walmart.com',
    zipcode: '43056',
  },
  // implementation: implementation,
};
