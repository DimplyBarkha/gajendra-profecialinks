
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    url: 'https://www.bol.com/nl/s/?searchtext={searchTerms}',
    loadedSelector: '.loader-control__content',
    noResultsXPath: '//div[@data-test="no-result-content"]',
    zipcode: '',
  },
};
