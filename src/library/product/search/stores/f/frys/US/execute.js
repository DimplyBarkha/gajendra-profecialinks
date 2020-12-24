
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'frys',
    domain: 'frys.com',
    url: 'https://www.frys.com/search?search_type=regular&sqxts=1&isFSK=true&cat=&query_string={searchTerms}&nearbyStoreName=false',
    loadedSelector: 'container',
    noResultsXPath: null,
    zipcode: '',
  },
};
