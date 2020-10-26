
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'rei',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#search-results',
    noResultsXPath: "//p[contains(text(),'Sorry, we couldn’t find any matches')]",
    openSearchDefinition: null,
    domain: 'rei.com',
    zipcode: '',
  },
};
