
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'foodservicedirect',
    domain: 'foodservicedirect.com',
    loadedSelector: 'div[class*="page__content"] div[class*="c-product-viewer__content"], div[class*="c-product-card"]',
    noResultsXPath: '//div[contains(@class, "p-404-recommendation")]//div[contains(@class, "p-404-recommendation__content")]',
  },
};
