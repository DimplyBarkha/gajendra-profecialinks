module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector:'body > ul > li.first > a',
    mutationSelector: null,
    spinnerSelector:'body > ul',
    loadedSelector: null,
    openSearchDefinition: null,
    domain: 'whisky.de',
  },
};
