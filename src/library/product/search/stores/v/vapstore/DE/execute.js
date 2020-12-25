
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'vapstore',
    domain: 'vapstore.de',
    url: 'https://www.vapstore.de/navi.php?suchausdruck={searchTerms}',
    loadedSelector: 'div#result-wrapper',
    noResultsXPath: 'div.alert-info',
    zipcode: "''",
  },
};
