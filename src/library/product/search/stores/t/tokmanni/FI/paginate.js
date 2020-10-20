
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, div.kuPagination2 a:nth-child(5)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#kuLandingProductsListUl > li',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
};
