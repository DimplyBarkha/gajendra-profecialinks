
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'div[data-test="product-page-columns"]',
    noResultsXPath: '//div[@data-test="non-deliverable"]',
    zipcode: '',
  },
};
