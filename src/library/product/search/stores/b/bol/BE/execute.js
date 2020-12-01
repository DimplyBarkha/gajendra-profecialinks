
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    domain: 'bol.com',
    url: 'https://www.bol.com/nl/s/?searchtext={searchTerms}',
    loadedSelector: 'ul.product-list',
    noResultsXPath: '//div[@data-test="no-result-content"]',
    zipcode: '',
  },
};
