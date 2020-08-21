
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'leons',
    domain: 'leons.ca',
    loadedSelector: 'div[data-section-id="product"]',
    noResultsXPath: '//div[contains(@class, "page-not-found")]',
    zipcode: '',
  },
};
