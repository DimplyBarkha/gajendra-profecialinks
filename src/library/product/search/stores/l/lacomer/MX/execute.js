
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    domain: 'lacomer.com.mx',
    url: 'https://www.lacomer.com.mx/lacomer/goBusqueda.action?succId=287&ver=mislistas&succFmt=100&criterio={searchTerms}#/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
