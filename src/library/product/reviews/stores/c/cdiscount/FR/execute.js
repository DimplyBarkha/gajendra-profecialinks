
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    domain: 'cdiscount.fr',
    loadedSelector: 'div[id="fpFAQRatings"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
