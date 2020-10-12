
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'joyces',
    nextLinkSelector: 'a[class="next page-numbers"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'joyces.ie',
    zipcode: '',
  },
};
