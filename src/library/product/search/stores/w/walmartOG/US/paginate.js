
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    nextLinkSelector: 'svg[data-automation-id="nextButton"]',
    mutationSelector: null,
    spinnerSelector: 'div[data-automation-id="spinner"]',
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"]',
    openSearchDefinition: null,
    domain: 'grocery.walmart.com',
  },
};
