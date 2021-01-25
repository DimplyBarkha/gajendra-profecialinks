
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    domain: 'sportsdirect.com',
    loadedSelector: 'div#productDetails h1',
    noResultsXPath: '//div[contains(@class,"SubHead")]/h2',
    zipcode: '',
  },
};
