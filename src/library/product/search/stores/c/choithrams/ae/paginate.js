
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    nextLinkSelector: 'li[class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'choithrams.com',
    zipcode: '',
  },
};
