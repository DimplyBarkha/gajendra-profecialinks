
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    domain: 'lomax.dk',
    url: 'https://www.lomax.dk/soeg/?q=dug',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
