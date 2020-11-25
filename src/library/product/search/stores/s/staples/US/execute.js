
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'staples',
    domain: 'staples.com',
    url: 'https://www.staples.com/11 x 17 copy paper/directory_{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
