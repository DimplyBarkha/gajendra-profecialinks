
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    domain: 'cyberport.at',
    url: 'https://www.cyberport.at/tools/search-results.html?autosuggest=true&q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
