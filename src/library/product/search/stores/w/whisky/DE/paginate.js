module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector:null,
    mutationSelector: null,
    spinnerSelector:null,
    loadedSelector:'body',
    openSearchDefinition: null,
    domain: 'whisky.de',
  },
};
