
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lyreco',
    domain: 'lyreco.com',
    url: 'https://www.lyreco.com/webshop/ENIR/search/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
