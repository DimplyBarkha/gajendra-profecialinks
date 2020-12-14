
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    nextLinkSelector: 'span[class="gicon-bracketright-green"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="rating__wrap"] > div',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'docmorris.de',
    zipcode: '',
  },
};
