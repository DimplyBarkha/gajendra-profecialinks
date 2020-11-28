
module.exports = {
  // implements: 'product/search/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'gianteagle',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: null,
    loadedSelector: 'div.ProductList',
    domain: 'gianteagle.com',
    zipcode: "'15276'",
  },
};
