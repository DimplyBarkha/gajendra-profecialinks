
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    domain: 'bell.ca',
    loadedSelector: 'div[class="dd-info-reviews-stars"] button[id="ratings-summary"]',
    noResultsXPath: '//main[@class="rsx-page-content error-page"]',
    zipcode: '',
  },
};
