
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    domain: 'fnac.es',
    loadedSelector: 'section.customerReviewsSection',
    noResultsXPath: '//section[@class="customerReviewsEmptySection"]',
    reviewUrl: '',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
