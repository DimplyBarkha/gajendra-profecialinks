
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'waitrose',
    domain: 'waitrose.com',
    url: 'https://www.waitrose.com/ecom/shop/search?&searchTerm={searchTerms}',
    loadedSelector: 'article[data-test="product-pod"]',
    noResultsXPath: '//h1[contains(@class,"title___3K4ea")]',
  },
};
