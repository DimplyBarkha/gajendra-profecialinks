
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'kalista-parfums',
    domain: 'kalista-parfums.com',
    loadedSelector: '.columns-container',
    noResultsXPath: '//p[contains(text(),"Aucun résultat trouvé")]',
    zipcode: '',
  },
};
