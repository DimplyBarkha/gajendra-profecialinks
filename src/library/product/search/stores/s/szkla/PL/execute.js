
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'szkla',
    domain: 'szkla.com',
    url: 'https://www.szkla.com/search.html?search_text={searchTerms}',
    loadedSelector: 'body>div.container',
    noResultsXPath: null,
    zipcode: '',
  },
};
