
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    domain: 'gracobaby.com',
    url: 'https://www.gracobaby.com/search?q={searchTerms}&start=0&sz=5000&view=product',
    loadedSelector: '#maincontent',
    noResultsXPath: null,
    zipcode: '',
  },
};
