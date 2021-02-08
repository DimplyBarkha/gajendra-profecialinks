
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'AU',
    store: 'chemistwarehouse',
    domain: 'chemistwarehouse.com.au',
    loadedSelector: '#BVRRContainer',
    noResultsXPath: null,
    reviewUrl: 'https://chemistwarehouse.com.au/buy/{id}',
    nextLinkXpath: null,//'//*[@id="BVRRContainer"]//div[contains(@class, "bv-content-pagination-container")]/ul/li[contains(@class, "bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next")]/a | //*[@id="BVRRContainer"]//div[contains(@class, "bv-content-pagination-container")]/ul/li[contains(@class, "bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next")]/button',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
