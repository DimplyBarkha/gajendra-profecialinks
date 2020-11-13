
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'academy',
    domain: 'academy.com',
    url: 'https://www.academy.com/shop/browse/search?searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
