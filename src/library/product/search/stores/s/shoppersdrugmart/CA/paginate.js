
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    nextLinkSelector: 'button[data-testid*="pagination-button-right"]:not(.plp__hidden__4k9wu)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[data-testid*="product-list"] a[class*="plp__productTileWrapper"]:last-child img',
    noResultsXPath: '//p[contains(@class,"plp__contactInstructions")]',
    openSearchDefinition: null,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
};
