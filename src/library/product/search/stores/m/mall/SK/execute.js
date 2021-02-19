
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    domain: 'mall.sk',
    url: 'https://www.mall.sk/hladaj?s={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
