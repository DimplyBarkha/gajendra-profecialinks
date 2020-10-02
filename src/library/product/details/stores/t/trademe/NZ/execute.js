
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    domain: 'trademe.co.nz',
    loadedSelector: null,
    noResultsXPath: '//p[contains(text(),"The page you requested was not found")]',
    zipcode: "''",
  },
};
