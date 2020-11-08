
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'heb_78204',
    domain: 'heb.com',
    loadedSelector: 'div[mode*="normal"] div[data-component*="FlyoutZoomView"]',
    noResultsXPath: '//h1[@class="search-result-title search-result-empty"]',
    zipcode: '78204',
  },
};
