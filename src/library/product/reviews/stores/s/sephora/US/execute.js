
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    domain: 'sephora.com',
    loadedSelector: 'div[rootid="ProductPage"], div[data-comp^=ProductGrid] a[data-comp^="ProductItem"]',
    noResultsXPath: '//h1[contains(text(), "0 Product results")] | //div[@id="zeroResult"] | //p[contains(text(),"Please check your search terms and try again.")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
