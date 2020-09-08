
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    domain: 'microspot.ch',
    url: 'https://www.microspot.ch/de/search?search={searchTerms}',
    loadedSelector: '#container-productlist',
    noResultsXPath: '//h1[@class="_3L3q2V Qmn5eI"]',
    zipcode: '',
  },
};
