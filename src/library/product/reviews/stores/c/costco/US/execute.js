
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    loadedSelector: 'ol.bv-content-list.bv-content-list-reviews',
    noResultsXPath: "//div[contains(@id, 'not_found_body')]",
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
