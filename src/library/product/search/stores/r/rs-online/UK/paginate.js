
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'rs-online',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, li a[class="paginationIcon nextPage "][title]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'uk.rs-online.com',
    zipcode: '',
  },
};
