
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[contains(text(), "We can\'t seem to find any results")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'selfridges.com',
    zipcode: '',
  },
};
