module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
  country: 'US',
  store: 'ajmadison',
  domain: 'ajmadison.com',
  url: 'https://www.ajmadison.com/b.php?Ntt={searchTerms}',
  loadedSelector: 'body',
  noResultsXPath: null,
  zipcode: '',
  },
  };