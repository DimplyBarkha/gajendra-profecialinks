
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    domain: 'amazon.sa',
    loadedSelector: '#productTitle',
    noResultsXPath: '//div[@id="g"]//img[contains(@alt,"Dogs")]',
    zipcode: '',
  },
};
