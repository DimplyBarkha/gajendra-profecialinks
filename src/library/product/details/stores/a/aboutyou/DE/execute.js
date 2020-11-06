
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    domain: 'aboutyou.de',
    noResultsXPath: '//div[@data-test-id="SoldOutContainer"]',
    zipcode: '',
  },
};
