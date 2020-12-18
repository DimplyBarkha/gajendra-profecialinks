
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'vapordna',
    domain: 'vapordna.com',
    loadedSelector: 'div#shopify-section-product-template > div.product-section:first-child div.stamped-content',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")] | //li[@id="tab-reviews" and @data-count="0"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
