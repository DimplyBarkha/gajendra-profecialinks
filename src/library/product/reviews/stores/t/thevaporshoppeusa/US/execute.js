
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    domain: 'thevaporshoppeusa.com',
    loadedSelector: 'div.spr-content div.spr-reviews',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
