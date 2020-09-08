
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    domain: 'smithandcaugheys.co.nz',
    loadedSelector: 'div#ProductDetail',
    noResultsXPath: '//title[contains(text(),"Page not found")]',
    zipcode: '',
  },
};
