
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    nextLinkSelector: 'span[class="pages"]:last-child a[class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'notino.de',
    zipcode: '',
  },
};
