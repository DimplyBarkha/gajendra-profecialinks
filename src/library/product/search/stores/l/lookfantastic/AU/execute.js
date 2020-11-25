
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'lookfantastic',
    domain: 'lookfantastic.com.au',
    url: 'https://www.lookfantastic.com.au/elysium.search?search={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
