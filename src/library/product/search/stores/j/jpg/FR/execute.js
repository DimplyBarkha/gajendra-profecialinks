
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    url: "https://www.jpg.fr/search?x=16&y=8&keywords={searchTerms}",
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
