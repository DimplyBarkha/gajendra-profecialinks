
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    domain: 'ebay.com.au',
    loadedSelector: '.srp-results  li, h1#itemTitle',
    noResultsXPath: '//div[contains(@class, "error-header")]//h1[contains(text(), "page is missing")]',
    zipcode: '',
  },
};
