
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'connection',
    domain: 'connection.com',
    url: 'https://www.connection.com/IPA/Shop/Product/Search?SearchType=1&term={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
