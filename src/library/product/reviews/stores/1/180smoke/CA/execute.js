
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'CA',
    store: '180smoke',
    domain: '180smoke.ca',
    loadedSelector: 'div.page-product-view--review--content',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
