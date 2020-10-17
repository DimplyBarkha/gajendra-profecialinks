
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whiskyzone',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.listing--container',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'whiskyzone.de',
    zipcode: '',
  },
};
