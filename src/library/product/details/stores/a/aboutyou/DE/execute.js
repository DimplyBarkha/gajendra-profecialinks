
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    domain: 'aboutyou.de',
    loadedSelector: 'div[data-test-id="ProductName"]',
    noResultsXPath: '//div[@data-test-id="SoldOutContainer"]',
    zipcode: '',
  },
};
