module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector:'body > div.goog-te-spinner-pos',
    mutationSelector: null,
    spinnerSelector:null,
    loadedSelector:'body',
    openSearchDefinition: null,
    domain: 'whisky.de',
  },
};
