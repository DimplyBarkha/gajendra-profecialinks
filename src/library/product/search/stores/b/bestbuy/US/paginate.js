
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    nextLinkSelector: 'a.sku-list-page-next[aria-disabled="false"]',
    mutationSelector: null, //"ol.paging-list",
    spinnerSelector: null,
    loadedSelector: 'ol.sku-item-list',
    noResultsXPath: "//div[contains(@class,'no-result')]",
    openSearchDefinition: null,
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
