
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    loadedSelector: 'div[@class="ProductDetails-reviews"]',
    noResultsXPath: '//div[@class="mt-80 text-center"]/h2',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
};
