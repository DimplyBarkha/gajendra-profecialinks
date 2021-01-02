
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'blu',
    domain: 'blu.com',
    url: 'https://www.blu.com/de/DE/deutschland/search?q={searchTerms}',
    loadedSelector: 'div.search-result__headerbox',
    noResultsXPath: null,
    zipcode: '',
  },
};
