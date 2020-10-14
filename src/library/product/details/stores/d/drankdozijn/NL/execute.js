
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'drankdozijn',
    domain: 'drankdozijn.nl',
    loadedSelector: 'article.product-details',
    noResultsXPath: '//h1[@class="header-404"]',
  },
};
