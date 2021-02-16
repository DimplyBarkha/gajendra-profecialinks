
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    domain: 'metro.ca',
    url: 'https://www.metro.ca/en/online-grocery/search?filter={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
