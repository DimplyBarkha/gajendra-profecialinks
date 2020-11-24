
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'lyreco',
    domain: 'lyreco.com',
    url: 'https://www.lyreco.com/webshop/DEDE/search/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
