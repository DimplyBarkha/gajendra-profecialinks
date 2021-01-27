const { implementation } = require('../../totalwine/executeImplementation');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine_95825',
    domain: 'totalwine.com',
    loadedSelector: 'div[class*="productResultContainer"]',
    noResultsXPath: '//input[contains(@value,"Not Found")] | //p[contains(.,"doesn’t exist")]',
    zipcode: '95825',
  },
  dependencies: {
    setZipCode: 'action:navigation/goto/setZipCode',
    createUrl: 'action:product/details/createUrl',
  },
  implementation,
};
