
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'VaporDNA',
    domain: 'vapordna.com',
    loadedSelector: 'div#shopify-section-product-template > div.product-section:first-child div.stamped-content',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
