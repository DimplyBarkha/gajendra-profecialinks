
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-et-name]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'medimax.de',
    zipcode: '',
  },
};
