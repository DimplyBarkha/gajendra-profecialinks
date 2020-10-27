
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    domain: 'feelunique.com',
    // url: "https://www.feelunique.com/skin/skin-concerns/blemish-prone-problem-skin?q={searchTerms}",
    url: "https://www.feelunique.com/search?q=soap",
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
