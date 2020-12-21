
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'us',
    store: 'instacart_kroger',
    domain: 'instacart.com',
    url: 'https://www.instacart.com/store/kroger/search_v3/Aha',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
