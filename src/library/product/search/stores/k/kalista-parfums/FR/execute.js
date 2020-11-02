module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'kalista-parfums',
    domain: 'kalista-parfums.com',
    url: 'https://www.kalista-parfums.com/fr/recherche?search_query={searchTerms}',
    loadedSelector: 'ul.product_list',
    noResultsXPath: '//p[contains(text(),"Aucun résultat trouv")]',
    zipcode: '',
  },  
};
