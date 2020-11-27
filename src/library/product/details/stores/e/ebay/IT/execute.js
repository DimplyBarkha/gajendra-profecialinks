module.exports = {
  implements: "product/details/execute",
  parameterValues: {
    country: "IT",
    store: "ebay",
    domain: "ebay.it",
    loadedSelector: "body",
    noResultsXPath: '//p[@class="error-header__headline"]',
  },
};
