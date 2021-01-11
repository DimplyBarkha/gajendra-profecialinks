module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    domain: 'hazesmokeshop.ca',
    loadedSelector: 'div.single-breadcrumbs-wrapper',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
