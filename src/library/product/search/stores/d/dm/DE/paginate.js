
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    nextLinkSelector: 'div[data-dmid="search-results"] > div.dd > div:last-child button#load-more-products-button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    openSearchDefinition: null,
    domain: 'dm.de',
  },
};
