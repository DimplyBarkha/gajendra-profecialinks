
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ziipstock',
    domain: 'ziipstock.com',
    url: 'https://ziipstock.com/collections/{searchTerms}',
    loadedSelector: 'main#MainContent',
    noResultsXPath: null,
    zipcode: "''",
  },
};
