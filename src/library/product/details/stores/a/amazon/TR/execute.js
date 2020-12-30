
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'amazon',
    domain: 'amazon.com.tr',
    loadedSelector: '#productTitle',
    noResultsXPath: '//div[@id="g"]//img[contains(@alt,"Dogs")]',
    zipcode: '',
  },
};
