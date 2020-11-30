
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    nextLinkSelector: 'button[class="nav-pagin-item--next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mall.com',
    zipcode: '',
  },
};
