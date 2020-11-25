
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lloydspharmacy',
    nextLinkSelector: 'a[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'lloydspharmacy.com',
    zipcode: '',
  },
};
