
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    domain: 'lookfantastic.com',
    url: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}',
    loadedSelector: "ul.productListProducts_products li",
    noResultsXPath: null,
  },
};
