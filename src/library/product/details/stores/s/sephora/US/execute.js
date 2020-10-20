
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    domain: 'sephora.com',
    loadedSelector: 'div[rootid="ProductPage"], div[data-comp^=ProductGrid] a[data-comp^="ProductItem"]',
    noResultsXPath: '//h1[contains(text(), "0 Product results")]',
  },
};
