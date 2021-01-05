module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    domain: 'footlocker.co.uk',
    loadedSelector: 'div[class*="product-details--summary"]',
    noResultsXPath: '//*[contains(text(),"not found")]',
    zipcode: '',
  },
};
