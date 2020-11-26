module.exports = {
  implements: "product/details/execute",
  parameterValues: {
    country: "IT",
    store: "ebay",
    domain: "ebay.it",
    loadedSelector: "div#CenterPanelInternal",
    noResultsXPath: '//p[@class="error-header__headline"]',
  },
};
