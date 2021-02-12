
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    domain: 'groceries.morrisons.com',
    loadedSelector: 'div.bop-reviews__navigationWrapper',
    noResultsXPath: '//div[@class="bop-reviews__fastReviewDescription"][contains(text(), "No reviews")]',
    reviewUrl: 'https://groceries.morrisons.com/products/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
