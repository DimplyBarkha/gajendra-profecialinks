
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    domain: 'mall.com',
    url: 'https://www.mall.sk/hladaj?s={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
