
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'courir',
    domain: 'courir.com',
    loadedXPath: '(//img[contains(@class,"primary-image")]/@src)[1]',
    noResultsXPath: '//div[@id="primary"]/img[@alt="404"]',
    zipcode: '',
  },
};
