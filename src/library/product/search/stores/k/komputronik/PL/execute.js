
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    domain: 'komputronik.pl',
    url: 'https://www.komputronik.pl/search/category/1?query={searchTerms}',
    loadedSelector: 'div#content',
    noResultsXPath: null,
    zipcode: "''",
  },
};
