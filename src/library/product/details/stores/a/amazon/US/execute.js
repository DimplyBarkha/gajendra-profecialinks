
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
    loadedSelector: '#productTitle',
    noResultsXPath: '//div[@id="g"]//img[contains(@alt,"Dogs")]',
    // noResultsXPath: '//span[contains(text(),"No results for")]'
  },
};
