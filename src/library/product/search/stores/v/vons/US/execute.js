
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vons',
    domain: 'vons.com',
    url: 'https://www.vons.com/shop/search-results.html?q=%22IPA%20beer%22',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
