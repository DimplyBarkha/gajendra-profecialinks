
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    domain: 'coop.co.uk',
    url: 'https://shop.coop.co.uk/search?term={searchTerms}',
    loadedSelector: 'article.product-card',
    noResultsXPath: '//h2[@class="page--title" and contains(.,"No products found for")]',
    zipcode: "''",
  },
};
