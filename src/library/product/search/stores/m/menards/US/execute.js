
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'menards',
    domain: 'menards.com',
    url: 'https://www.menards.com/main/search.html?ipp=36&search={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
