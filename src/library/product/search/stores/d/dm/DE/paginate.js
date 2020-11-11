
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-dmid=product-grid-container]',
    noResultsXPath: '//h1[contains(text(),"ergab leider keine Treffer")]',
    openSearchDefinition: null,
    domain: 'dm.de',
    zipcode: '',
  },
};
