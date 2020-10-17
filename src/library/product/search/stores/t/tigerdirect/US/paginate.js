
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, table tbody tr td a.paginatNext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tigerdirect.com',
    zipcode: '',
  },
};
