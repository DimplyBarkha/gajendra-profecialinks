
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'labaie',
    domain: 'labaie.com',
    loadedSelector: '.primary-images-wrapper',
    noResultsXPath: '//span[contains(@class,"search-no-result")]|//div[contains(@class,"home-page")]|//div[contains(@class,"error-page-main")]',
    zipcode: '',
  },
};
