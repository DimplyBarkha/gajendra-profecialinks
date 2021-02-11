const { implementation } = require('../executeImplementation');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    domain: 'totalwine.com',
    loadedSelector: 'div[class*="productResultContainer"]',
    noResultsXPath: '//title[contains(text(),"Not Found")] | //input[contains(@value,"Not Found")] | //p[contains(.,"doesn’t exist")]| //p[contains(@class,resultsTitle)]/span[contains(text(),"No results for ")]',
  },
  dependencies: {
    setZipCode: 'action:navigation/goto/setZipCode',
    createUrl: 'action:product/details/createUrl',
  },
  implementation,
};
