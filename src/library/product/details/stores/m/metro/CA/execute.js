
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    domain: 'metro.ca',
    loadedSelector: '#main-img img',
    noResultsXPath: '//div[contains(@class,"error-container")]',
    zipcode: '',
  },
};
