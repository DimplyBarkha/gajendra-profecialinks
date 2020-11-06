
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'farmadelivery',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#algolia_instant_selector div#algolia-right-container',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'farmadelivery.com.br',
    zipcode: '',
  },
};
