
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ZA',
    store: 'woolworths',
    domain: 'woolworths.co.za',
    loadedSelector: 'figure.zoom img',
    noResultsXPath: '//div[text()="NO PRODUCT ITEM is available for product with this Id"]',
    zipcode: '',
  },
};
