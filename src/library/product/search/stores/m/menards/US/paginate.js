
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'menards',
    nextLinkSelector: 'a[class="btn btn-circle"] i',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'menards.com',
    zipcode: '',
  },
};
