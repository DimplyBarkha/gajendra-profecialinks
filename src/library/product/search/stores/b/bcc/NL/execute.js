
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    domain: 'bcc.nl',
    url: 'https://www.bcc.nl/search?fh_location=%2F%2Fcatalog01%2Fnl_NL%2Fchannel>%7Bm2ebcc2enl%7D&search={searchTerms}',
    loadedSelector: '.products-container',
    noResultsXPath: '//div[@class=\'no-search-results\']',
    zipcode: '',
  },
};
