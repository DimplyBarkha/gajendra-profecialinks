
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'ES',
    store: 'eroski',
    domain: 'supermercado.eroski.es',
    loadedSelector: 'li.top-categories',
    noResultsXPath: null,
    zipcode: "''",
  },
};
