
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class=\'no-search-results\']',
    openSearchDefinition: {
      template: 'https://www.bcc.nl/search?fh_location=%2F%2Fcatalog01%2Fnl_NL%2Fchannel>%7Bm2ebcc2enl%7D&search={searchTerms}&index={page}',
    },
    domain: 'bcc.nl',
    zipcode: '',
  },
};
