
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    nextLinkSelector: 'button[name="searchnextclick"]:not(.btn__disabled)',
    mutationSelector: null,
    spinnerSelector: 'div.wag-search-loading-icon',
    loadedSelector: '//div[contains(@class, "wag-coupon-productcard")]',
    noResultsXPath: '//h1[@id="zero-result-alert"]',
    openSearchDefinition: null,
    domain: 'walgreens.com',
  },
};
