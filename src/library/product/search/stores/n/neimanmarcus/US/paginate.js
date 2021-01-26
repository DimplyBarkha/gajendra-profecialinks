
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'neimanmarcus',
    nextLinkSelector: '#noPagination',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
      // template: 'https://www.neimanmarcus.com/{queryParams}?page={page}',
    zipcode: '',
    domain: 'neimanmarcus.com',
  },
};
