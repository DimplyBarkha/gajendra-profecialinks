
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    nextLinkSelector: 'a[aria-label="Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(), "There are no results for")]',
    openSearchDefinition: null,
    domain: 'jumia.co.ke',
    zipcode: '',
  },
};
