
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    nextLinkSelector: '.next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#id-productos-list , .next a',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'larebajavirtual.com',
    zipcode: '',
  },
};
