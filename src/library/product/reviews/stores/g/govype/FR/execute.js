
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'govype',
    domain: 'govype.com',
    loadedSelector: 'div.page-bottom',
    noResultsXPath: '//div[@id="custom_noReview"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
