
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ziipstock',
    domain: 'ziipstock.com',
    url: 'https://ziipstock.com/search?q={searchTerms}',
    loadedSelector: 'main#MainContent',
    noResultsXPath: null,
    zipcode: "''",
  },
};
