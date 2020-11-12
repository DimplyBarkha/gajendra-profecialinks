
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    nextLinkSelector: 'div[class="right"] a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
};