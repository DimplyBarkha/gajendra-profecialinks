
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    url: 'https://www.jumbo.com/producten/?searchTerms={searchTerms}',
    loadedSelector: '.rw',
    noResultsXPath: null,
    zipcode: '',
  },
};
