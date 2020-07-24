
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    domain: 'amazon.com',
    loadedSelector: '#productTitle',
    noResultsXPath: '(//img[contains(@alt,"Sorry! Something went wrong on our end. ")]|//div[@id="g"]//img[contains(@alt,"Dogs")])[1]',
  },
};
