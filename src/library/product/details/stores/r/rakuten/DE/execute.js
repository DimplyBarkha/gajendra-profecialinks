
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'rakuten',
    domain: 'rakuten.de',
    loadedSelector: 'body[data-base-url]',
    noResultsXPath: '//div[@id="debugger-iframe"]',
    zipcode: '',
  },
};
