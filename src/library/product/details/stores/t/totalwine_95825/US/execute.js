const { implementation } = require('../../totalwine/executeImplementation');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine_95825',
    domain: 'totalwine.com',
    loadedSelector: 'div[class*="productResultContainer"]',
    noResultsXPath: '//input[contains(@value,"Not Found")]',
    zipcode: '95825',
  },
  implementation,
};
