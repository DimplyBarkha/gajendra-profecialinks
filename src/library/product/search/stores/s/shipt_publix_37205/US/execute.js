
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'shipt_publix_37205',
    domain: 'shop.shipt.com',
    url: 'https://shop.shipt.com/search?query={searchTerms}',
    loadedSelector: 'ul[data-test="ProductGrid-list"] > li img',
    noResultsXPath: '//h2[contains(@class, "SearchEmptyState") and contains(text(), "no results were found")]',
    zipcode: '37205',
  },
};
