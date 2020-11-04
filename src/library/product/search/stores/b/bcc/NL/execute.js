
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    domain: 'bcc.nl',
    url: 'https://www.bcc.nl/search?search={searchTerms}',
    loadedSelector: '.products-container',
    noResultsXPath: '//div[@class=\'no-search-results\']',
    zipcode: '',
  },
};
