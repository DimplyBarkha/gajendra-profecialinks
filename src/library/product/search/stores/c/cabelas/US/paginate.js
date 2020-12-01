
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    nextLinkSelector: 'a[class="right_arrow "]',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    loadedSelector: 'body',
    domain: 'cabelas.com',
    zipcode: '',
  },
};