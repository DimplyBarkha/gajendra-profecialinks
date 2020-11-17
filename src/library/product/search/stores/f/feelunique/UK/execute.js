
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    domain: 'feelunique.com',
    url: "https://www.feelunique.com/search?q={searchTerms}",
    // url: 'https://www.feelunique.com/search?q=nyx%20eyeshadow',
    // url: 'https://www.feelunique.com/hair/treatments/hair-masks?q=HAIRMASK',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
