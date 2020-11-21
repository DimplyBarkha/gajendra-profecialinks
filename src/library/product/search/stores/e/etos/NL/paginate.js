
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'etos',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.c-tabs',
    noResultsXPath: '//div[@class="noresults__copy"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'etos.nl',
    zipcode: '',
  },
};
