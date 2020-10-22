
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    nextLinkSelector: 'a[title="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#kuLandingProductsListUl >li',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
};
