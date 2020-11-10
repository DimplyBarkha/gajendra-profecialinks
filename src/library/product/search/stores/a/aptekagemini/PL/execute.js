module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'aptekagemini',
    domain: 'aptekagemini.pl',
    url: 'https://www.aptekagemini.pl/znajdz?query={searchTerms}',
    loadedSelector: '[class="ais-SortBy"]',
    noResultsXPath: '//div/h2[@class=""]',
    zipcode: '',
  },

};
