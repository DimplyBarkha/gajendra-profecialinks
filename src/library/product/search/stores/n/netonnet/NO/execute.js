
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    domain: 'netonnet.no',
    url: 'https://www.netonnet.no/Search?query={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"alert-warning search-warning")]',
    zipcode: '',
  },
};
