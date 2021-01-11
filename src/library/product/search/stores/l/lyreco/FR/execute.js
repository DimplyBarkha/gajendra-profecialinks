
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'lyreco',
    domain: 'lyreco.fr',
    url: 'https://www.lyreco.com/webshop/FRFR/search/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};