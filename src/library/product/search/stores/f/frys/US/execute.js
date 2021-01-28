
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'frys',
    domain: 'frys.com',
    url: 'https://www.frys.com/search?search_type=regular&sqxts=1&isFSK=true&cat=&query_string={searchTerms}&nearbyStoreName=false',
    // url : 'https://www.frys.com/search?resultpage=0&start=0&rows=100&pType=&cat=&nearbyStoreName=false&query_string=36+gas+range&inq=36+gas+range',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
