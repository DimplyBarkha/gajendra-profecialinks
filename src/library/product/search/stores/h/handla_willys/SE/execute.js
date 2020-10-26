
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'handlawillys',
    domain: 'willys.se',
    url: 'https://www.willys.se/sok?q={searchTerms}',
    loadedSelector: 'div.ax-search-result',
    noResultsXPath: '//div[contains(@class,"no-search-result")]',
    zipcode: '',
  },
};
