
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'footlocker',
    domain: 'footlocker.com',
    url: 'https://www.footlocker.com/search?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
