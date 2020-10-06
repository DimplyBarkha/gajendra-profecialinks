
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    domain: 'farmers.co.nz',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"ish-content")]',
    zipcode: '',
  },
};
