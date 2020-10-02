
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'netonnet',
    domain: 'netonnet.se',
    url: 'https://www.netonnet.se/Search?query={searchTerms}', 
    loadedSelector: 'div#searchResultProducts > div#productList > div.row',
    noResultsXPath: '//div[contains(@class,"alert-warning search-warning")]',
    zipcode: '',
  },
};
