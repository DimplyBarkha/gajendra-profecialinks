
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: `//pre[contains(., '"count":0')]`,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://merqueo.com/api/3.1/stores/63/search?q={searchTerms}&page={page}&per_page=50&zoneId=40',
    },
    domain: 'merqueo.com',
    zipcode: '',
  },
};
