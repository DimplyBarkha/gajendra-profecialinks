
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, div#kuPagination2 > a[title=Next]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
};
