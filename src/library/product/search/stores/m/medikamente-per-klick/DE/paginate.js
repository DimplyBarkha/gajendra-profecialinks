
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medikamente-per-klick',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productsList',
    openSearchDefinition: null,
    domain: 'medikamente-per-klick.de',
  },
};
