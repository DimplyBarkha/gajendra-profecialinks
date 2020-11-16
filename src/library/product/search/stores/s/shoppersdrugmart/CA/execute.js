
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    domain: 'shoppersdrugmart.ca',
    url: 'https://shop.shoppersdrugmart.ca/search?text={searchTerms}',
    loadedSelector: 'section[data-testid*="product-list"] a[class*="plp__productTileWrapper"]:last-child img',
    noResultsXPath: '//p[contains(@class,"plp__contactInstructions")]',
    zipcode: '',
  },
};
