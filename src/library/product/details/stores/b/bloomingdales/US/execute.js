
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    domain: 'bloomingdales.com',
    loadedSelector: 'div[id="mainContent"]',
    noResultsXPath: '//div[@class="zeroResultsSearchMessage"] | //p[@data-auto="error-text"]',
    zipcode: '',
  },
};
