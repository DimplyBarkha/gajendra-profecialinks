module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    domain: 'intermarche.com',
    loadedSelector: 'div[class*="ProductWrapper"] img[class*="ProductImage"]',
    noResultsXPath: '',
    zipcode: '',
  },
};