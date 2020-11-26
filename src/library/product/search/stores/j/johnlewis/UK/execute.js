
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    domain: 'johnlewis.com',
    url: 'https://www.johnlewis.com/search?search-term={searchTerms}&suggestion=true#_search_suggestion_referral',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
