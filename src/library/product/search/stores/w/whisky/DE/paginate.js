module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector:null,
    mutationSelector: null,
    spinnerSelector:null,
    loadedSelector:'div[id="article-filter-container"]',
    openSearchDefinition: null,
    domain: 'whisky.de',
  },
};
