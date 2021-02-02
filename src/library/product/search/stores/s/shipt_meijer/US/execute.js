
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'shipt_meijer',
    domain: 'shop.shipt.com',
    url: 'https://shop.shipt.com/search?query={searchTerms}',
    loadedSelector: 'ul[data-test="ProductGrid-list"]',
    noResultsXPath: '//div[contains(@class,"SearchEmptyState__Header")]',
    zipcode: "''",
  },
};
