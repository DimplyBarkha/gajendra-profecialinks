
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'gianteagle',
    domain: 'gianteagle.com',
    url: 'https://shop.gianteagle.com/harbor-creek/search?q={searchTerms}',
    loadedSelector: 'div.ProductList',
    zipcode: "'15276'",
  },
};
