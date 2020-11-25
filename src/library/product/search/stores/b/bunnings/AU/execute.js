
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'bunnings',
    domain: 'bunnings.com.au',
    url: 'https://www.bunnings.com.au/search/products?q={searchTerms}',
    loadedSelector: 'div.js-search-container',
    noResultsXPath: null,
    zipcode: '',
  },
};
