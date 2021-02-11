
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'joker',
    domain: 'joker.com.tr',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"not-found-content")]',
    zipcode: '',
  },
};
