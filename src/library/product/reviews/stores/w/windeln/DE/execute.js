
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    domain: 'windeln.de',
    loadedSelector: 'div.ratings-list.ratings-list-preselected div.ratings-list-item',
    noResultsXPath: '//div[@class="main-wrapper"][contains(., "die Seite konnte leider nicht gefunden werden")]|//div[@class="ratings-list-no-ratings"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
