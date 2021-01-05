
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'amazon',
    domain: 'amazon.com.mx',
    url: 'https://www.amazon.com.mx/s?k={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
