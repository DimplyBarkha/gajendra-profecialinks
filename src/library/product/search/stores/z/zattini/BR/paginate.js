
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'zattini',
    nextLinkSelector: 'a[class="ns-icon ns-icon-arrow-right last next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'zattini.com.br',
    zipcode: '',
  },
};
