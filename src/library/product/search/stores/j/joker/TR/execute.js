
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'joker',
    domain: 'joker.com.tr',
    url: 'https://www.joker.com.tr/arama/?keyword={searchTerms}&personaclick_search_query={searchTerms}&personaclick_input_query={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
