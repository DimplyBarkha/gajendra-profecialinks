module.exports = {
  implements: "product/details/execute",
  parameterValues: {
    country: "IT",
    store: "ebay",
    domain: "ebay.it",
    loadedSelector: "body",
    noResultsXPath: '//div[@class="status--4XX"]',
  },
};
