module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'nfm',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//p[contains(text(), 'No Results Found')]",
    openSearchDefinition: {
      template: 'https://www.nfm.com/{searchTerms}?pg={page}',
    },
    domain: 'nfm.com',
    zipcode: '',
  },
};
