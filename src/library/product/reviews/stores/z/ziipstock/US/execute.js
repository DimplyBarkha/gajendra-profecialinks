
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'ziipstock',
    domain: 'ziipstock.com',
    loadedSelector: 'div.stamped-reviews',
    noResultsXPath: '//li[@id="tab-reviews" and @data-count="0"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
