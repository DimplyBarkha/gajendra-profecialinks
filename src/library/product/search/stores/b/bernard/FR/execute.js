
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'bernard',
    domain: 'bernard.fr',
    url: 'https://www.bernard.fr/search?x=0&y=0&keywords={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
