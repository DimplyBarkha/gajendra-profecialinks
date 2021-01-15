
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'govype',
    domain: 'govype.com',
    loadedSelector: 'div.ts-wrapper',
    noResultsXPath: '//div[@id="custom_noReview"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
