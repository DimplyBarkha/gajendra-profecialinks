
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'handlaWillys',
    domain: 'willys.se',
    url: 'https://www.willys.se/sok?q={searchTerms}&size=150',
    loadedSelector: 'div.ax-search-result',
    noResultsXPath: '//div[contains(@class,"no-search-result")]',
    zipcode: '',
  },
};
