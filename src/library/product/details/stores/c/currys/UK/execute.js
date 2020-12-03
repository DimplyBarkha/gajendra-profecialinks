
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    domain: 'currys.co.uk',
    loadedSelector: 'div#product-main',
    noResultsXPath: '//div[contains(@class,"resultList")]|//a[@class="e404-btn"]',
    zipcode: "''",
  },
};
