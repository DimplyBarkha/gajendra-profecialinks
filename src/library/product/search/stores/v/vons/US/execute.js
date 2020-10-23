
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vons',
    domain: 'vons.com',
    url: 'https://www.vons.com/shop/search-results.html?q=%22beer%2012%20pack%22',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
