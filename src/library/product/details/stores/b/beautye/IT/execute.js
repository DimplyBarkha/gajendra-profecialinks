
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    domain: 'beautye.it',
    loadedSelector: null,
    noResultsXPath: "//h1[contains(@class,'page-title')]/span[contains(text(),'Risultati di ricerca per:')]",
    zipcode: '',
  },
};
