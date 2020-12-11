
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'VaporDNA',
    nextLinkSelector: 'div#shopify-section-product-template > div.product-section:first-child div.stamped-content div.stamped-reviews a[aria-label="Next page"]',
    nextLinkXpath: '//div[@id="shopify-section-product-template"]//div[@class="product-section"][1]//div[@class="stamped-content"]//div[@class="stamped-reviews"]//a[@aria-label="Next page"]',
    mutationSelector: 'div#shopify-section-product-template > div.product-section:first-child div.stamped-content div.stamped-review',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'vapordna.com',
    zipcode: "''",
  },
};
