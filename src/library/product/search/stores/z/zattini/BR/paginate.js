module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'zattini',
    nextLinkSelector: "#pagnNextString, #pagnNextLink, div.pagination a.ns-icon.ns-icon-arrow-right.last.next",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#item-list',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'zattini.com.br',
    zipcode: '',
  },
};