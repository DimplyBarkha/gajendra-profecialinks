
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    domain: 'merqueo.com',
    url: 'https://merqueo.com/api/3.1/stores/63/search?q={searchTerms}&page=1&per_page=50&zoneId=40',
    loadedSelector: null,
    noResultsXPath: `//pre[contains(., '"count":0')]`,
    zipcode: '',
  },
};
