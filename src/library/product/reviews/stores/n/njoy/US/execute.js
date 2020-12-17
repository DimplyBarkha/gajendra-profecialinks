
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    domain: 'shop.njoy.com',
    loadedSelector: 'div[data-review-id]:not(.yotpo-hidden),a[class="button confirmm-age"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
