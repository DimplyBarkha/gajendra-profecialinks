
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SI',
    store: 'mimovrste',
    domain: 'mimovrste.com',
    url: 'https://www.mimovrste.com/iskanje?s={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
