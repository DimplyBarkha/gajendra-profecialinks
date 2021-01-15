
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'harristeeter',
    domain: 'harristeeter.com',
    loadedSelector: 'hts-product-details',
    noResultsXPath: '//title[position()=1][not(text())]',
    zipcode: '',
  },
};
