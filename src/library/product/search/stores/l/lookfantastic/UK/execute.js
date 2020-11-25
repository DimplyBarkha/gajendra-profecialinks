
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    domain: 'lookfantastic.com',
    url: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}',
    loadedSelector: "body",
    noResultsXPath: null,
  },
};
