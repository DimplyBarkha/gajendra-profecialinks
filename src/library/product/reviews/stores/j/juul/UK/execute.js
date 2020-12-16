
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'juul',
    domain: 'juul.co.uk',
    loadedSelector: '*[class="product-page__reviews"]',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
