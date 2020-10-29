
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    domain: 'reservebar.com',
    url: 'https://www.reservebar.com/search?q={searchTerms}',
    loadedSelector: 'ul.grid--view-items  li:first-child img',
    noResultsXPath: '//div[@id="category"]//h1',
    zipcode: '',
  },
};
