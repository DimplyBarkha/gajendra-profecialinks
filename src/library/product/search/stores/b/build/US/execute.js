
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'build',
    domain: 'build.com',
    url: 'https://www.build.com/search?term={searchTerms}',
    loadedSelector: 'div.js-product-grid-container,div.flex.flex-wrap > div[class*="bg-theme-white"]:nth-child(1)',
    noResultsXPath: "//div[@id='no-results-page']|//div[contains(@data-finding-method,'browse') and contains(@class,'js-tile-content')]",
    zipcode: '',
  },
};
