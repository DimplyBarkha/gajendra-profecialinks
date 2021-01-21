
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'juul',
    domain: 'juul.com',
    loadedSelector: '*[class="product-page__reviews"]',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
