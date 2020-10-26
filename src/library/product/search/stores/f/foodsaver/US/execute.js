
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    domain: 'foodsaver.com',
    url: 'https://www.foodsaver.com/search?q={searchTerms}',
    // loadedSelector: null,
    // noResultsXPath: null,
    zipcode: '',
  },
};
