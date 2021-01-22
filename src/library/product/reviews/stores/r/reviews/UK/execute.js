
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    domain: 'reviews.co.uk',
    loadedSelector: 'div.StorePage__content',
    noResultsXPath: '//div[@class="Page404__errorCode"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
