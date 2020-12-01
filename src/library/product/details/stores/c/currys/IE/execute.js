
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'currys',
    domain: 'currys.ie',
    loadedSelector: '#product-main',
    noResultsXPath: '//div[contains(@class,"resultList")]|//a[@class="e404-btn"]',
    zipcode: "''",
  },
};
