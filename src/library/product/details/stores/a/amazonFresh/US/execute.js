
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    domain: 'amazon.com',
    loadedSelector: '#productTitle',
    noResultsXPath: '//div[@id="g"]//img[contains(@alt,"Dogs")]',
  },
};
