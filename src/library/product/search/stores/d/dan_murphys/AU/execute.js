
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'dan_murphys',
    domain: 'danmurphys.com.au',
    url: 'https://www.danmurphys.com.au/search?searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
