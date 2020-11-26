
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'itvsn',
    domain: 'itvsn.com.au',
    loadedSelector: 'div[class="tvsn-productmedia-viewer"] img',
    noResultsXPath: '//div[contains(@class,"row tvsn-category-list")]//div[contains(@class,"tvsn-category-empty")]',
  },
};
