
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    domain: 'paris.cl',
    url: 'https://www.paris.cl/search?q={searchTerms}',
    loadedSelector: 'ul#search-result-items',
    noResultsXPath: '//p[@class="not-found-search"]',
    zipcode: '',
  },
};
