
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    domain: 'fnac.es',
    loadedSelector: 'section.customerReviewsSection',
    noResultsXPath: '//section[@class="customerReviewsEmptySection"]|/html[not(//*[@class="js-customer-reviews"])]',
    reviewUrl: 'https://www.fnac.es/p/a6179672/avis',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
