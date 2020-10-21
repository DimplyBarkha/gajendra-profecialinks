
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'vons',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, div.kuPagination2 a:nth-child(5)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#kuLandingProductsListul > li',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'vons.com',
    zipcode: '',
  },
};
