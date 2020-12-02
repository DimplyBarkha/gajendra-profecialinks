
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'build',
    domain: 'build.com',
    loadedSelector: 'div#product-images-container',
    noResultsXPath: '//div[contains(@class,"discontinued-text")]',
    zipcode: '',
  },
};
