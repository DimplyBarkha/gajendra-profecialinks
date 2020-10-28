module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector:null,
    mutationSelector: null,
    spinnerSelector:'body > div.goog-te-spinner-pos',
    loadedSelector: 'body > ul',
    openSearchDefinition: null,
    domain: 'whisky.de',
  },
};
