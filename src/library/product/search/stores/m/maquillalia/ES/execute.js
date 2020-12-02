
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'maquillalia',
    domain: 'maquillalia.com',
    url: "https://www.maquillalia.com/search.php?buscar={searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
