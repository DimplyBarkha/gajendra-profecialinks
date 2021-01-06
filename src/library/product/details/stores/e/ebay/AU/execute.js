
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    domain: 'ebay.com.au',
    loadedSelector: '.srp-results  li, h1#itemTitle, h1.product-title',
    noResultsXPath: null,
    zipcode: '',
  },
};
