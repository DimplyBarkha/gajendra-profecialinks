
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    domain: 'gracobaby.com',
    url: 'https://www.gracobaby.com/search?q=home+and+gear',
    loadedSelector: '#maincontent',
    noResultsXPath: null,
    zipcode: '',
  },
};
