
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'lyreco',
    domain: 'lyreco.com',
    url: 'https://www.lyreco.com/webshop/FRFR/search/bic',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
