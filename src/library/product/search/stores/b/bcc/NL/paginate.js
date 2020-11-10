
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
      template: 'https://www.bcc.nl/?search={searchTerms}&index={page}',
    },
    domain: 'bcc.nl',
    zipcode: '',
  },
};
