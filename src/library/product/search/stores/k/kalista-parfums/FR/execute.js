module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'kalista-parfums',
    domain: 'kalista-parfums.com',
    url: 'https://www.kalista-parfums.com/fr/recherche?search_query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: 'p.alert.alert-warning',
    zipcode: '',
  },  
};
