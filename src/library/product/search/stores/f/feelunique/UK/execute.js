
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    domain: 'feelunique.com',
    url: 'https://www.feelunique.com/search?q={searchTerms}',
    loadedSelector: 'div[class="Product"]',
    noResultsXPath: null,
  },
};
