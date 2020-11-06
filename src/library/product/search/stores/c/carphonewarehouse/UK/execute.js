
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'carphonewarehouse',
    domain: 'carphonewarehouse.com',
    url: 'https://www.carphonewarehouse.com/search.html?keyword={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
