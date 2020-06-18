
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"],div[data-automation-id="productsListPage"] [data-automation-id="noResultsSearchTerm"]',
    openSearchDefinition: {
      template: 'https://grocery.walmart.com/search/?query={searchTerms}&page={page}',
    },
    domain: 'grocery.walmart.com',
  },
};
