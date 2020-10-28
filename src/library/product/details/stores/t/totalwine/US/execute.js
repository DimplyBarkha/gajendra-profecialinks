const { implementation } = require('../executeImplementation');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    domain: 'totalwine.com',
    loadedSelector: 'div[class*="productResultContainer"]',
    noResultsXPath: '//input[contains(@value,"Not Found")] | //p[contains(.,"doesn’t exist")]',
  },
  implementation,
};
