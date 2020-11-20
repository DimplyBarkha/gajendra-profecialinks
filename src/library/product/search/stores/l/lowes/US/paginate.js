
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    nextLinkSelector: 'a[aria-label="arrow right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a > span > article > span',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
