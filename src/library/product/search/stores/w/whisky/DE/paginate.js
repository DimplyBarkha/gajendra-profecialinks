module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector:'body > ul > li:nth-child(1) > a > font > font',
    mutationSelector: null,
    spinnerSelector:null,
    loadedSelector: 'body',
    openSearchDefinition: null,
    domain: 'whisky.de',
  },
};
