
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'build',
    nextLinkSelector: "a[role='button'].js-next-page:not([disabled]),div[role='button'][data-automation='next-page-button']:not([disabled])",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.js-product-grid-container,div.flex.flex-wrap > div[class*="bg-theme-white"]:nth-child(1)',
    noResultsXPath: "//div[@id='no-results-page']|//div[contains(@data-finding-method,'browse') and contains(@class,'js-tile-content')]",
    openSearchDefinition: null,
    domain: 'build.com',
    zipcode: '',
  },
};
